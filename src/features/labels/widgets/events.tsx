import {
	useEnumsEvents,
	useEnumsStep,
	useFilterdateStep,
	useQueryAnalytics,
} from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { AspectRatio, Center, Stack } from "@mantine/core";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { EventsAnalytic } from "./ui/events-analytic";
import { EventsBar } from "./ui/events-bar";
import { EventsLine } from "./ui/events-line";
import { EventsTable } from "./ui/events-table";

type Element = Record<AnalyticEvent, number>;

export interface LabelsEventsProps {
	filterdate: IRequestAnalytics["filterdate"];
	step?: IRequestAnalytics["step"];
	events?: AnalyticEvent[];
	type?: "line" | "bar" | "table" | "analytic";
}

const ee = useEnumsEvents();
const es = useEnumsStep();

const ititValue = Object.fromEntries(
	Object.keys(ee.data).map((item) => [item, 0]),
);

export const LabelsEvents = ({
	filterdate,
	step = "d",
	events = ["v", "i", "d", "p"],
	type = "line",
}: LabelsEventsProps) => {
	const [query, setQuery] = useState<Partial<IRequestAnalytics>>({
		filterdate,
		step,
	});

	const { fetch } = useQueryAnalytics(query);
	const { production_id } = useStoreUserProfile();
	const [data, setData] = useState<Record<AnalyticEvent, IResponseAnalytics>>();

	const labels = useFilterdateStep(query as IRequestAnalytics);

	// Извлекаем, групируем данные
	const ddata = useMemo(() => {
		if (!data) {
			return [];
		}
		const currProduction = Number(production_id || 0);
		const ddata: Record<string, Element> = {};

		for (const date of labels) {
			ddata[date] = ddata[date] || ({ ...ititValue } as Element);

			for (const event in data) {
				for (const production of data[event as AnalyticEvent]?.production ||
					[]) {
					if (
						currProduction > 0 &&
						production.production_id !== currProduction
					) {
						continue;
					}

					for (const item of production.data) {
						if (step === "s") {
							if (dayjs(item.timestamp).format("ss") === date) {
								ddata[date][event as AnalyticEvent] += item.count;
							}
						} else if (step === "m") {
							if (dayjs(item.timestamp).format("mm") === date) {
								ddata[date][event as AnalyticEvent] += item.count;
							}
						} else if (step === "h") {
							if (dayjs(item.timestamp).format("HH") === date) {
								ddata[date][event as AnalyticEvent] += item.count;
							}
						} else {
							if (dayjs(item.timestamp).format("YYYY-MM-DD") === date) {
								ddata[date][event as AnalyticEvent] += item.count;
							}
						}
					}
				}
			}
		}

		return Object.entries(ddata)
			.map(([date, data]) => ({
				...data,
				date,
			}))
			.map((item) => ({
				...item,
				total: events.reduce((acc, key) => acc + item[key] || 0, 0),
			}));
	}, [data, labels, production_id]);

	const isEmpty = useMemo(() => !ddata.length, [ddata]);

	useEffect(() => {
		(async function () {
			setData({
				v: (await fetch({ ...query, event: "v" })) as IResponseAnalytics,
				i: (await fetch({ ...query, event: "i" })) as IResponseAnalytics,
				d: (await fetch({ ...query, event: "d" })) as IResponseAnalytics,
				p: (await fetch({ ...query, event: "p" })) as IResponseAnalytics,
			});
		})();
	}, [query]);

	useEffect(() => {
		setQuery({ filterdate, step });
	}, [filterdate, step]);

	return (
		<Stack h="100%">
			<AspectRatio ratio={16 / 9}>
				{isEmpty ? (
					<Center w="100%" h="100%" fz="h1" c="dimmed">
						Данные ненашлись!
					</Center>
				) : type === "table" ? (
					<EventsTable
						query={query as IRequestAnalytics}
						data={ddata
							.filter((item) => item.total > 0)
							.sort((a, b) => a.date.localeCompare(b.date))}
						events={events}
					/>
				) : type === "bar" ? (
					<EventsBar query={query} data={ddata} events={events} />
				) : type === "analytic" ? (
					<EventsAnalytic query={query} data={ddata} events={events} />
				) : (
					<EventsLine query={query} data={ddata} events={events} />
				)}
			</AspectRatio>
		</Stack>
	);
};

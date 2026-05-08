import {
	useEnumsEvents,
	useFilterdateStep,
	useQueryAnalytics
} from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { AspectRatio, Center, Stack } from "@mantine/core";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { type MouseHandlerDataParam } from "recharts";
import { EventsAnalytic } from "./ui/events-analytic";
import { EventsBar } from "./ui/events-bar";
import { EventsLine } from "./ui/events-line";
import { EventsStack } from "./ui/events-stack";
import { EventsTable } from "./ui/events-table";
type Element = Record<AnalyticEvent, number>;

export interface AnalyticEventsProps {
	filterdate: IRequestAnalytics["filterdate"];
	step?: IRequestAnalytics["step"];
	events?: AnalyticEvent[];
	type?: "line" | "bar" | "table" | "analytic" | "stack";
	percent?: AnalyticEvent[];
	stop?: SliceStep;
	onClick?: (arg: MouseHandlerDataParam, e: React.MouseEvent) => void;
}

const ee = useEnumsEvents();

const ititValue = Object.fromEntries(
	Object.keys(ee.data).map((item) => [item, 0]),
);

export const AnalyticEvents = ({
	filterdate,
	step = "d",
	events = ["v", "i", "d", "p"],
	type = "line",
	stop = "m",
	percent = ["d"],
	onClick,
}: AnalyticEventsProps) => {
	const production_id = Number(
		useStoreUserProfile((state) => state.production_id) || 0,
	);

	const [query, setQuery] = useState<IRequestAnalytics>({
		filterdate,
		step,
		production_id,
	} as IRequestAnalytics);

	const { fetch } = useQueryAnalytics(query);

	const [data, setData] = useState<Record<AnalyticEvent, IResponseAnalytics>>();

	const labels = useFilterdateStep(query);

	// Извлекаем, групируем данные
	const ddata = useMemo(() => {
		if (!data) {
			return [];
		}

		const ddata: Record<string, Element> = {};

		for (const date of labels) {
			ddata[date] = ddata[date] || ({ ...ititValue } as Element);

			for (const event in data) {
				for (const production of data[event as AnalyticEvent]?.production ||
					[]) {
					if (production_id > 0 && production.production_id !== production_id) {
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

	const dddata = useMemo(() => {
		return ddata.sort((a, b) => a.date.localeCompare(b.date));
	}, [ddata]);

	const isEmpty = useMemo(
		() => dddata.every((item) => item.total < 1),
		[dddata],
	);

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
		setQuery({
			filterdate,
			step,
			production_id,
		} as IRequestAnalytics);
	}, [filterdate, step, production_id]);

	const handleClick = (arg: MouseHandlerDataParam, e: React.MouseEvent) => {
		if (query.step === stop) {
			return;
		}
		const { activeLabel } = arg;
		if (!activeLabel) {
			return;
		}
		const total = ddata.find((item) => item.date === activeLabel)?.total || 0;
		if (total === 0) {
			return;
		}
		onClick?.(arg, e);
	};

	return (
		<Stack h="100%">
			{isEmpty ? (
				<Center w="100%" h="100%" fz="h1" c="dimmed">
					Данные ненашлись!
				</Center>
			) : type === "table" ? (
				<EventsTable
					query={query as IRequestAnalytics}
					data={dddata.filter((item) => item.total > 0)}
					events={events}
					percent={percent}
					onClick={handleClick}
				/>
			) : type === "bar" ? (
				<AspectRatio ratio={16 / 9}>
					<EventsBar
						query={query as IRequestAnalytics}
						data={dddata}
						events={events}
						onClick={handleClick}
					/>
				</AspectRatio>
			) : type === "analytic" ? (
				<AspectRatio ratio={16 / 9}>
					<EventsAnalytic
						query={query as IRequestAnalytics}
						data={dddata}
						events={events}
						onClick={handleClick}
					/>
				</AspectRatio>
			) : type === "stack" ? (
				<AspectRatio ratio={16 / 9}>
					<EventsStack
						query={query as IRequestAnalytics}
						data={dddata}
						events={events}
						onClick={handleClick}
					/>
				</AspectRatio>
			) : (
				<AspectRatio ratio={16 / 9}>
					<EventsLine
						query={query as IRequestAnalytics}
						data={dddata}
						events={events}
						onClick={handleClick}
					/>
				</AspectRatio>
			)}
		</Stack>
	);
};

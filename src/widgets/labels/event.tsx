import {
	useEnumsEvents,
	useEnumsStep,
	useQueryAnalytics,
} from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { Widget, type WidgetProps } from "@/shared/ui";
import { AspectRatio, Center, Stack } from "@mantine/core";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { EventBar } from "./ui/event-bar";
import { EventLine } from "./ui/event-line";
import { EventTable } from "./ui/event-table";
import { Filterdate } from "./ui/filterdate";

type Element = Record<AnalyticEvent, number>;

export interface WidgetLabelsEventProps extends WidgetProps {
	filterdate: IRequestAnalytics["filterdate"];
	step?: IRequestAnalytics["step"];
	lines?: AnalyticEvent[];
	type?: "line" | "bar" | "table";
}

const ee = useEnumsEvents();
const es = useEnumsStep();

const ititValue = Object.fromEntries(
	Object.keys(ee.data).map((item) => [item, 0]),
);

export const WidgetLabelsEvent = ({
	filterdate,
	step = "d",
	lines = ["v", "i", "d", "p"],
	type = "line",
	...props
}: WidgetLabelsEventProps) => {
	const [query, setQuery] = useState<Partial<IRequestAnalytics>>({
		filterdate,
		step,
	});
	const { production_id } = useStoreUserProfile();
	const { isLoading, fetch, error } = useQueryAnalytics(query);
	const [data, setData] = useState<Record<AnalyticEvent, IResponseAnalytics>>();

	async function sendRequest(event: AnalyticEvent) {
		return await fetch({ ...query, event });
	}

	// Извлекаем список дат

	const labels = useMemo<string[]>(() => {
		const cnt = dayjs(filterdate[1]).diff(filterdate[0], "d");
		const labels: string[] = [];
		const d = dayjs(filterdate[0]);
		for (let i = 0; i <= cnt; i++) {
			labels.push(d.add(i, "d").format("YYYY-MM-DD"));
		}
		return labels;
	}, [filterdate]);

	// Извлекаем, групируем данные
	const ddata = useMemo(() => {
		if (!data) {
			return [];
		}
		const currProduction = Number(production_id || 0);
		const ddata: Record<string, Element> = {};

		for (const event in data) {
			for (const production of data[event as AnalyticEvent]?.production || []) {
				if (currProduction > 0 && production.production_id !== currProduction) {
					continue;
				}
				for (const item of production.data) {
					const date = dayjs(item.timestamp).format("YYYY-MM-DD");
					ddata[date] = ddata[date] || ({ ...ititValue } as Element);
					ddata[date][event as AnalyticEvent] += item.count;
				}
			}
		}

		return Object.entries(ddata).map(([date, data]) => ({
			...data,
			date,
		}));
	}, [data, labels, production_id]);

	const isEmpty = useMemo(() => !ddata.length, [ddata]);

	useEffect(() => {
		(async function () {
			setData({
				v: await sendRequest("v"),
				i: await sendRequest("i"),
				d: await sendRequest("d"),
				p: await sendRequest("p"),
			});
		})();
	}, [query]);
	useEffect(() => {
		setQuery({ filterdate, step });
	}, [filterdate, step]);

	return (
		<Widget
			loading={isLoading}
			error={error}
			{...props}
			title={
				<Filterdate
					filterdate={query.filterdate}
					editable={!filterdate?.[0]}
					onChange={(filterdate) => {
						setQuery({
							...query,
							filterdate,
						});
					}}
				/>
			}
		>
			<Stack h="100%">
				<AspectRatio ratio={16 / 9}>
					{isEmpty ? (
						<Center w="100%" h="100%" fz="h1" c="dimmed">
							Данные ненашлись!
						</Center>
					) : type === "table" ? (
						<EventTable data={ddata} lines={lines} />
					) : type === "bar" ? (
						<EventBar data={ddata} lines={lines} />
					) : (
						<EventLine data={ddata} lines={lines} />
					)}
				</AspectRatio>
			</Stack>
		</Widget>
	);
};

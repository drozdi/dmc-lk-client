import {
	AnalyticsEmpty,
	useEnumsEvents,
	useFetchAnalyticsEvents,
	useFilterdateStep,
} from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { ChartSkeleton } from "@/shared/ui/skeleton";
import { Stack } from "@mantine/core";
import dayjs from "dayjs";
import { memo, useEffect, useMemo } from "react";
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
	onLoaded?: (data: any) => void;
	onLoading?: (loading: boolean) => void;
}

const ee = useEnumsEvents();

const initValue = Object.fromEntries(
	Object.keys(ee.data).map((item) => [item, 0]),
);

export const AnalyticEvents = memo(function AnalyticEvents({
	filterdate,
	step = "d",
	events = ["v", "i", "d", "p"],
	type = "line",
	stop = "m",
	percent = ["d"],
	onClick,
	onLoaded,
	onLoading,
}: AnalyticEventsProps) {
	const production_id = useStoreUserProfile((state) => state.productions);

	const { data, query, isLoading, isFetching } = useFetchAnalyticsEvents(
		{
			filterdate,
			step,
			production_id,
		},
		events,
	);

	const labels = useFilterdateStep(query);

	const ddata = useMemo(() => {
		if (!data || !Object.keys(data).length) {
			return [];
		}

		const ddata: Record<string, Element> = {};

		for (const date of labels) {
			ddata[date] = ddata[date] || ({ ...initValue } as Element);

			for (const event in data) {
				for (const production of data[event as AnalyticEvent]?.production ||
					[]) {
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
						} else if (dayjs(item.timestamp).format("YYYY-MM-DD") === date) {
							ddata[date][event as AnalyticEvent] += item.count;
						}
					}
				}
			}
		}

		return Object.entries(ddata)
			.map(([date, row]) => ({
				...row,
				date,
			}))
			.map((item) => ({
				...item,
				total: events.reduce((acc, key) => acc + (item[key] || 0), 0),
			}));
	}, [data, labels, step, events]);

	const dddata = useMemo(() => {
		return ddata.sort((a, b) => a.date.localeCompare(b.date));
	}, [ddata]);

	const isEmpty = useMemo(
		() => !dddata.length || dddata.every((item) => item.total < 1),
		[dddata],
	);

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

	const showSkeleton = (isLoading || isFetching) && !Object.keys(data).length;

	useEffect(() => {
		onLoading?.(isLoading || isFetching);
	}, [isLoading, isFetching, onLoading]);

	useEffect(() => {
		onLoaded?.(dddata);
	}, [onLoaded, dddata]);

	return (
		<Stack h="100%">
			{showSkeleton ? (
				<ChartSkeleton height="100%" mih={180} />
			) : isEmpty ? (
				<AnalyticsEmpty query={query} />
			) : type === "table" ? (
				<EventsTable
					query={query as IRequestAnalytics}
					data={dddata.filter((item) => item.total > 0)}
					events={events}
					percent={percent}
					onClick={handleClick}
				/>
			) : type === "bar" ? (
					<EventsBar
						query={query as IRequestAnalytics}
						data={dddata}
						events={events}
						onClick={handleClick}
					/>
			) : type === "analytic" ? (
					<EventsAnalytic
						query={query as IRequestAnalytics}
						data={dddata}
						events={events}
						onClick={handleClick}
					/>
			) : type === "stack" ? (
					<EventsStack
						query={query as IRequestAnalytics}
						data={dddata}
						events={events}
						onClick={handleClick}
					/>
			) : (
					<EventsLine
						query={query as IRequestAnalytics}
						data={dddata}
						events={events}
						onClick={handleClick}
					/>
			)}
		</Stack>
	);
});

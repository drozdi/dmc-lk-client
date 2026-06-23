import {
	AnalyticsEmpty,
	useEnumsEvents,
	useFetchAnalyticsEvents,
} from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { LegendContentPie, TooltipContentPie } from "@/shared/ui";
import { ChartSkeleton } from "@/shared/ui/skeleton";
import { AspectRatio } from "@mantine/core";
import { memo, useEffect, useMemo } from "react";
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const ee = useEnumsEvents();

export interface AnalyticPieProps {
	filterdate: IRequestAnalytics["filterdate"];
	events?: AnalyticEvent[];
	percent?: boolean;
	onLoading?: (loading: boolean) => void;
}

export const AnalyticPie = memo(function AnalyticPie({
	filterdate,
	events = ["v", "d", "i"],
	percent,
	onLoading,
}: AnalyticPieProps) {
	const productions = useStoreUserProfile((state) => state.productions);

	const { data, query, isLoading, isFetching } = useFetchAnalyticsEvents(
		{
			filterdate,
			production_id: productions,
		},
		events,
	);

	const ddata = useMemo<
		Array<{
			event: AnalyticEvent;
			name: string;
			value: number;
			fill: string;
		}>
	>(() => {
		const res = Object.fromEntries(
			events.map((event) => [
				event,
				{
					value: 0,
					color: ee.findColorByCode(event),
				},
			]),
		) as Record<
			AnalyticEvent,
			{
				value: number;
				color: string;
			}
		>;

		for (const event in res) {
			res[event as AnalyticEvent].value = Number(
				data[event as AnalyticEvent]?.sum_company || 0,
			);
		}

		return Object.entries(res).map(([name, { value, color }]) => ({
			event: name as AnalyticEvent,
			name: ee.findLabelByCode(name as AnalyticEvent),
			value,
			fill: color,
		}));
	}, [data, events]);

	const total = useMemo(
		() => ddata.reduce((acc, item) => acc + item.value, 0),
		[ddata],
	);

	const isEmpty = useMemo(
		() => !ddata.some(({ value }) => value > 0),
		[ddata],
	);

	const showSkeleton = (isLoading || isFetching) && !Object.keys(data).length;

	useEffect(() => {
		onLoading?.(isLoading || isFetching);
	}, [isLoading, isFetching, onLoading]);

	const formatter = (value: number) =>
		percent ? `${Math.round((value / total) * 100)}%` : value;

	return (
		<AspectRatio ratio={16 / 9} h="100%">
			{showSkeleton ? (
				<ChartSkeleton height="100%" mih={180} />
			) : isEmpty ? (
				<AnalyticsEmpty query={query} />
			) : (
				<ResponsiveContainer>
					<PieChart>
						<Tooltip content={TooltipContentPie} formatter={formatter} />
						<Legend
							layout="vertical"
							verticalAlign="bottom"
							align="left"
							content={LegendContentPie}
							formatter={formatter}
						/>

						<Pie data={ddata} dataKey="value" cx="50%" cy="50%" />
					</PieChart>
				</ResponsiveContainer>
			)}
		</AspectRatio>
	);
});

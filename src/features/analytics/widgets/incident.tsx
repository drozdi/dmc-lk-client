import { AnalyticsEmpty, useQueryIncident } from '@/entites/analytics';
import { serializeIncidentParamsKey } from "@/entites/analytics";
import { randomColorLabel } from "@/entites/labels";
import {
	LegendContentPie,
	TooltipContentPie
} from "@/shared/ui";
import { ChartSkeleton } from "@/shared/ui/skeleton";
import { AspectRatio } from "@mantine/core";
import { useEffect, useMemo } from "react";
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export interface AnalyticIncidentSlice {
	name: string;
	value: number;
	fill: string;
}

export interface AnalyticIncidentProps {
	filterdate: IRequestAnalyticsIncident["filterdate"];
	onSliceClick?: (slice: AnalyticIncidentSlice) => void;
	onLoading?: (loading: boolean) => void;
	onLoaded?: (data: AnalyticIncidentSlice[]) => void;
}

export const AnalyticIncident = ({
	filterdate,
	onSliceClick,
	onLoading,
	onLoaded,
}: AnalyticIncidentProps) => {
	const incidentParams = {
		filterdate: filterdate || [null, null],
		data: [] as string[],
		fields_name: [] as string[],
	};
	const paramsKey = serializeIncidentParamsKey(incidentParams);
	const { data, isLoading, isFetching } = useQueryIncident(incidentParams);

	const showSkeleton = (isLoading || isFetching) && !data.length;

	useEffect(() => {
		onLoading?.(isLoading || isFetching);
	}, [isLoading, isFetching, onLoading]);

	const ddata = useMemo(() => {
		return (data || []).map((item) => ({
			name: item.data,
			value: item.total_counter,
			fill: randomColorLabel(item.data),
		}));
	}, [data, paramsKey]);

	useEffect(() => {
		onLoaded?.(ddata);
	}, [ddata, onLoaded]);

	const isEmpty = !ddata.length;

	return (
		<AspectRatio ratio={16 / 9}>
			{showSkeleton ? (
				<ChartSkeleton height="100%" mih={180} />
			) : isEmpty ? (
				<AnalyticsEmpty query={incidentParams} />
			) : (
				<ResponsiveContainer key={paramsKey}>
					<PieChart>
						<Tooltip content={TooltipContentPie} />
						<Legend
							layout="vertical"
							verticalAlign="middle"
							align="left"
							content={LegendContentPie}
						/>
						<Pie
							key={paramsKey}
							data={ddata}
							dataKey="value"
							nameKey="name"
							cx="50%"
							cy="50%"
							isAnimationActive={false}
							style={{ cursor: onSliceClick ? "pointer" : undefined }}
							onClick={(slice) => {
								if (!onSliceClick || !slice?.name) {
									return;
								}

								onSliceClick({
									name: String(slice.name),
									value: Number(slice.value),
									fill: String(slice.payload?.fill || slice.fill || ""),
								});
							}}
						/>
					</PieChart>
				</ResponsiveContainer>
			)}
		</AspectRatio>
	);
};

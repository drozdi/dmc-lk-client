import {
	AnalyticsEmpty,
	classifyDefect,
	useAnalytics,
} from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { randomColorLabel } from "@/entites/labels";
import { LegendContentPieFactory, TooltipContentPie } from "@/shared/ui";
import { ChartSkeleton } from "@/shared/ui/skeleton";
import { AspectRatio, Stack } from "@mantine/core";
import { useMemo, useState } from "react";
import {
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Sector,
	Tooltip,
	type LegendPayload,
	type PieSectorDataItem,
} from "recharts";

export interface AnalyticEventsDefectProps {
	filterdate: IRequestAnalytics["filterdate"];
	step?: IRequestAnalytics["step"];
	event?: IRequestAnalytics["event"];
}

const renderActiveShape = ({
	cx,
	cy,
	midAngle,
	innerRadius,
	outerRadius,
	startAngle,
	endAngle,
	fill,
	payload,
	percent,
	value,
	name,
	...props
}: PieSectorDataItem) => {
	const isSelected = props["data-recharts-item-id"] === name;
	const RADIAN = Math.PI / 180;
	const sin = Math.sin(-RADIAN * (midAngle ?? 1));
	const cos = Math.cos(-RADIAN * (midAngle ?? 1));
	const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;
	const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;
	const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;
	const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;
	const ex = mx + (cos >= 0 ? 1 : -1) * 22;
	const ey = my;
	const textAnchor = cos >= 0 ? "start" : "end";

	return (
		<g>
			<Sector
				cx={cx}
				cy={cy}
				innerRadius={innerRadius}
				outerRadius={outerRadius}
				startAngle={startAngle}
				endAngle={endAngle}
				fill={fill}
			/>
			{isSelected && (
				<>
					<Sector
						cx={cx}
						cy={cy}
						startAngle={startAngle}
						endAngle={endAngle}
						innerRadius={(outerRadius ?? 0) + 6}
						outerRadius={(outerRadius ?? 0) + 10}
						fill={fill}
					/>
					<path
						d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
						stroke={fill}
						fill="none"
					/>
					<circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
					<text
						x={ex + (cos >= 0 ? 1 : -1) * 12}
						y={ey}
						textAnchor={textAnchor}
						fill="#333"
					>{`${name}`}</text>
				</>
			)}
		</g>
	);
};

export const AnalyticEventsDefect = ({
	filterdate,
	step = "d",
	event = "d",
}: AnalyticEventsDefectProps) => {
	const production_id = useStoreUserProfile((state) => state.productions);
	const { data, query, isLoading, isFetching } = useAnalytics({
		filterdate,
		step,
		event,
		production_id,
	});

	const ddata = useMemo(() => {
		if (!data) {
			return [];
		}

		const ddata: Record<string, number> = {};

		for (const production of data.production || []) {
			for (const item of production.data) {
				const d = classifyDefect(item.data);
				ddata[d] = (ddata[d] || 0) + item.count;
			}
		}

		return Object.entries(ddata).map(([name, value]) => ({
			name,
			value,
			fill: randomColorLabel(name),
		}));
	}, [data]);

	const isEmpty = useMemo(() => !ddata.length, [ddata]);
	const showSkeleton = (isLoading || isFetching) && !data?.production?.length;

	const [selected, setSelected] = useState<string>();
	const onLegendClick = (arg: LegendPayload) => {
		setSelected((v) => (v === arg.value ? "" : arg.value));
	};

	return (
		<Stack h="100%">
			{showSkeleton ? (
				<ChartSkeleton height="100%" mih={180} />
			) : isEmpty ? (
				<AnalyticsEmpty query={query} />
			) : (
				<AspectRatio ratio={16 / 9}>
					<ResponsiveContainer>
						<PieChart>
							<Tooltip content={TooltipContentPie} />
							<Legend
								align="left"
								layout="vertical"
								verticalAlign="top"
								width="50%"
								content={LegendContentPieFactory(selected)}
								onClick={onLegendClick}
							/>
							<Pie
								shape={renderActiveShape}
								id={selected}
								data={ddata}
								width="50%"
								dataKey="value"
								nameKey="name"
								cx="50%"
								cy="50%"
							/>
						</PieChart>
					</ResponsiveContainer>
				</AspectRatio>
			)}
		</Stack>
	);
};

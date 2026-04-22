import { useEnumsEvents, useEnumsStep } from "@/entites/analytics";
import { randomColorLabel } from "@/entites/labels";
import { $setting } from "@/shared";
import { Box, NumberFormatter } from "@mantine/core";
import dayjs from "dayjs";
import { memo } from "react";
import {
	Bar,
	BarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
	type BarShapeProps,
	type TooltipContentProps,
} from "recharts";

export interface EventsAnalyticProps {
	query: IRequestAnalytics;
	data: (Record<AnalyticEvent, number> & {
		date: string;
		total: number;
	})[];
	events?: AnalyticEvent[];
}

const ee = useEnumsEvents();
const es = useEnumsStep();

const CustomNestedBar = (props: BarShapeProps) => {
	const { x, y, width, height, payload, fill } = props;
	const { total, v } = payload;
	const totalHeight = (height / v) * total;
	const gap = Math.min(16, width * 0.25);

	return (
		<g>
			<rect
				x={x}
				y={y - (totalHeight - height)}
				width={width}
				height={totalHeight}
				fill={randomColorLabel("def")}
			/>
			<rect
				x={x + gap}
				y={y}
				width={width - 2 * gap}
				height={height}
				fill={fill}
			/>
		</g>
	);
};

const CustomNestedBar1 = (props: BarShapeProps) => {
	const { x, y, width, height, fill } = props;
	const gap = Math.min(16, width * 0.25);

	return (
		<g>
			<rect
				x={x + gap}
				y={y}
				width={width - 2 * gap}
				height={height}
				fill={fill}
			/>
		</g>
	);
};

export const EventsAnalytic = memo(
	({ query, data, events = [] }: EventsAnalyticProps) => {
		return (
			<ResponsiveContainer>
				<BarChart responsive stackOffset="positive" data={data}>
					<XAxis
						dataKey="date"
						tickFormatter={(date) => {
							if (
								query.step === "s" ||
								query.step === "m" ||
								query.step === "h"
							) {
								return date;
							}
							return dayjs(date).format($setting.get("formatDate"));
						}}
					/>
					<YAxis />
					<Tooltip
						content={(arg: TooltipContentProps) => {
							const { label, active, payload, separator, activeIndex } = arg;
							if (active && payload && payload.length) {
								return (
									<Box
										bg="var(--mantine-color-body)"
										bd="1px solid var(--mantine-color-default-border)"
										p="xs"
									>
										<p>
											{["s", "m", "h"].includes(query.step)
												? label
												: dayjs(label).format($setting.get("formatDate"))}
										</p>
										<p>
											Всего {separator}{" "}
											<NumberFormatter
												value={data[activeIndex].total as number}
											/>
										</p>
										{events.map((event) => (
											<p
												key={event}
												style={{
													color: ee.findColorByCode(event),
												}}
											>
												{ee.findLabelByCode(event)} {separator}{" "}
												<NumberFormatter
													value={data[activeIndex][event] as number}
												/>
											</p>
										))}
									</Box>
								);
							}
							return null;
						}}
					/>
					{events.map((event, index) => (
						<Bar
							dataKey={event}
							stackId="a"
							name={ee.findLabelByCode(event)}
							fill={ee.findColorByCode(event)}
							background
							shape={index === 0 ? CustomNestedBar : CustomNestedBar1}
						/>
					))}
				</BarChart>
			</ResponsiveContainer>
		);
	},
);

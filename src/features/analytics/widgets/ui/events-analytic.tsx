import { useEnumsEvents, useEnumsStep } from "@/entites/analytics";
import { randomColorLabel } from "@/entites/labels";
import { $setting } from "@/shared";
import { TooltipContentBar } from "@/shared/ui";
import { AspectRatio } from "@mantine/core";
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
} from "recharts";
import type { EventsProps } from "./type";

export interface EventsAnalyticProps extends EventsProps {}

const ee = useEnumsEvents();
const es = useEnumsStep();

const CustomNestedBar = (props: BarShapeProps) => {
	const { x, y, width, height, payload, fill } = props;
	const { total, v } = payload;
	let totalHeight = (height / v) * total;
	const gap = Math.min(16, width * 0.25);

	if (Number.isNaN(totalHeight)) {
		totalHeight = height;
	}

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
	({ query, data, events = [], ...props }: EventsAnalyticProps) => {
		return (
			<AspectRatio ratio={16 / 9}>
				<ResponsiveContainer>
					<BarChart responsive stackOffset="positive" data={data} {...props}>
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
							content={TooltipContentBar}
							labelFormatter={(label) =>
								dayjs(label).format($setting.get("formatDate"))
							}
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
			</AspectRatio>
		);
	},
);

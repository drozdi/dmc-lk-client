import { useEnumsEvents } from "@/entites/analytics";
import { randomColorLabel } from "@/entites/labels";
import { $setting } from "@/shared";
import { TooltipContentBar } from "@/shared/ui";
import dayjs from "dayjs";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
	type BarShapeProps,
} from "recharts";
import type { EventsProps } from "./type";

export interface EventsBarProps extends EventsProps {}

const ee = useEnumsEvents();

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

export const EventsBar = ({
	query,
	data = [],
	events = [],
	...props
}: EventsBarProps) => {
	return (
		<ResponsiveContainer>
			<BarChart data={data} {...props}>
				<CartesianGrid stroke="#aaa" strokeDasharray="5 5" />
				<XAxis
					dataKey="date"
					tickFormatter={(date) =>
						dayjs(date).format($setting.get("formatDate"))
					}
				/>
				<YAxis />
				<Tooltip
					content={TooltipContentBar}
					labelFormatter={(label) =>
						dayjs(label).format($setting.get("formatDate"))
					}
				/>
				<Legend />
				{events.map((line) => (
					<Bar
						key={line}
						dataKey={line}
						name={ee.findLabelByCode(line)}
						fill={ee.findColorByCode(line)}
						stroke={ee.findColorByCode(line)}
						label={ee.findLabelByCode(line) as any}
						background
					/>
				))}
			</BarChart>
		</ResponsiveContainer>
	);
};

import { useEnumsEvents } from "@/entites/analytics";
import { $setting } from "@/shared";
import { TooltipContentBar } from "@/shared/ui";
import dayjs from "dayjs";
import { useMemo } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import type { EventsProps } from "./type";

export interface EventsStackProps extends EventsProps {}

const ee = useEnumsEvents();

export const EventsStack = ({
	query,
	data = [],
	events = [],
	...props
}: EventsStackProps) => {
	const midle = useMemo(
		() => data.reduce((acc, item) => acc + item.total, 0) / data.length,
		[data],
	);
	return (
		<ResponsiveContainer>
			<BarChart data={data} {...props}>
				<CartesianGrid stroke="#aaa" strokeDasharray="5 5" />
				<XAxis
					dataKey="date"
					tickFormatter={(date) =>
						["s", "m", "h"].includes(query.step)
							? date
							: dayjs(date).format($setting.get("formatDate"))
					}
				/>
				<YAxis />
				<Tooltip
					content={TooltipContentBar}
					labelFormatter={(label) =>
						["s", "m", "h"].includes(query.step)
							? label
							: dayjs(label).format($setting.get("formatDate"))
					}
				/>
				{midle && (
					<ReferenceLine
						y={midle}
						label={{
							value: "Среднее",
							position: "insideBottomRight",
						}}
						stroke="red"
						strokeDasharray="3 3"
					/>
				)}
				<Legend />
				{events.map((line) => (
					<Bar
						key={line}
						dataKey={line}
						stackId={line === "p" ? "a" : "b"}
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

import { useEnumsEvents } from "@/entites/analytics";
import { $setting } from "@/shared";
import { TooltipContentBar } from "@/shared/ui";
import { AspectRatio } from "@mantine/core";
import dayjs from "dayjs";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import type { EventsProps } from "./type";

export interface EventLineProops extends EventsProps {}

const ee = useEnumsEvents();

export const EventsLine = ({
	query,
	data = [],
	events = [],
	...props
}: EventLineProops) => {
	return (
		<AspectRatio ratio={16 / 9}>
			<ResponsiveContainer>
				<LineChart data={data} {...props}>
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
					{events.map((event) => (
						<Line
							key={event}
							dataKey={event}
							name={ee.findLabelByCode(event)}
							type="monotone"
							stroke={ee.findColorByCode(event)}
							label={ee.findLabelByCode(event) as any}
						/>
					))}
				</LineChart>
			</ResponsiveContainer>
		</AspectRatio>
	);
};

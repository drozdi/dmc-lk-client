import { useEnumsEvents } from "@/entites/analytics";
import { $setting } from "@/shared";
import { Box, NumberFormatter, Text } from "@mantine/core";
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
	type TooltipContentProps,
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
					content={({ label, payload, separator }: TooltipContentProps) => {
						return (
							<Box
								bg="var(--mantine-color-body)"
								bd="1px solid var(--mantine-color-default-border)"
								p="xs"
							>
								<Text>{dayjs(label).format($setting.get("formatDate"))}</Text>
								{payload.map((item) => (
									<Text c={item.color}>
										{item.name} {separator}{" "}
										<NumberFormatter value={item.value} />
									</Text>
								))}
							</Box>
						);
					}}
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
	);
};

import { useEnumsEvents } from "@/entites/analytics";
import { $setting } from "@/shared";
import { Box, NumberFormatter, Text } from "@mantine/core";
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
	type TooltipContentProps,
} from "recharts";
import type { EventsProps } from "./type";

export interface EventsBarProps extends EventsProps {}

const ee = useEnumsEvents();

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
				{events.map((line) => (
					<Bar
						key={line}
						dataKey={line}
						name={ee.findLabelByCode(line)}
						fill={ee.findColorByCode(line)}
						stroke={ee.findColorByCode(line)}
						label={ee.findLabelByCode(line) as any}
					/>
				))}
			</BarChart>
		</ResponsiveContainer>
	);
};

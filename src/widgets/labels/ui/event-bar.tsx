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

const ee = useEnumsEvents();

export interface EventLineProops {
	data: (Record<AnalyticEvent, number> & {
		date: string;
	})[];
	lines?: AnalyticEvent[];
}

export const EventBar = ({ data = [], lines = ["p"] }: EventLineProops) => {
	return (
		<ResponsiveContainer>
			<BarChart data={data}>
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
				{lines.map((line) => (
					<Bar
						key={line}
						dataKey={line}
						stackId={line === "p" ? line : "a"}
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

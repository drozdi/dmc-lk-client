import { useEnumsEvents } from "@/entites/analytics";
import { $setting } from "@/shared";
import { NumberFormatter } from "@mantine/core";
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

const ee = useEnumsEvents();

export interface EventLineProops {
	data: (Record<AnalyticEvent, number> & {
		date: string;
	})[];
	lines?: AnalyticEvent[];
}

export const EventLine = ({ data = [], lines = ["p"] }: EventLineProops) => {
	return (
		<ResponsiveContainer>
			<LineChart data={data}>
				<CartesianGrid stroke="#aaa" strokeDasharray="5 5" />
				<XAxis
					dataKey="date"
					tickFormatter={(date) =>
						dayjs(date).format($setting.get("formatDate"))
					}
				/>
				<YAxis />
				<Tooltip
					formatter={(value) => (
						<NumberFormatter value={value} thousandSeparator=" " />
					)}
				/>
				<Legend />
				{lines.map((line) => (
					<Line
						key={line}
						dataKey={line}
						name={ee.findLabelByCode(line)}
						type="monotone"
						stroke={ee.findColorByCode(line)}
						label={ee.findLabelByCode(line) as any}
					/>
				))}
			</LineChart>
		</ResponsiveContainer>
	);
};

import { NumberFormatter } from "@mantine/core";
import { memo } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
	type TooltipContentProps,
} from "recharts";

export interface TypeBarProps {
	data: {
		name: string;
		value: number;
		color: string;
	}[];
	bars: string[];
}

export const TypeBar = memo(({ data, bars }: TypeBarProps) => {
	return (
		<ResponsiveContainer>
			<BarChart data={data}>
				<Tooltip
					content={({ label, separator, payload }: TooltipContentProps) => (
						<p
							style={{
								backgroundColor: "white",
								border: "1px solid #ccc",
								padding: "0.5em 1em",
							}}
						>
							{label} {separator}{" "}
							<NumberFormatter
								value={payload[0]?.value as number}
								thousandSeparator=" "
							/>
						</p>
					)}
				/>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" />
				<YAxis />

				<Bar dataKey="value" background>
					{data.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={entry.color} />
					))}
				</Bar>
			</BarChart>
		</ResponsiveContainer>
	);
});

import { Box, NumberFormatter } from "@mantine/core";
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
					content={({ label, separator, payload }: TooltipContentProps) => {
						return (
							<Box
								bg="var(--mantine-color-body)"
								bd="1px solid var(--mantine-color-default-border)"
								p="xs"
							>
								<span style={{ color: payload[0]?.payload?.color }}>
									{label}
								</span>
								{separator}
								<NumberFormatter value={payload[0]?.value as number} />
							</Box>
						);
					}}
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

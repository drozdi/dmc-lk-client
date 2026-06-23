import { randomColorLabel } from "@/entites/labels";
import { TooltipContentBar } from "@/shared/ui";
import { AspectRatio } from "@mantine/core";
import { memo, useState } from "react";
import {
	Bar,
	BarChart,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
	type LegendPayload,
} from "recharts";
import { type LabelsProps } from "./type";

export interface LabelsBarProps extends LabelsProps {}

export const LabelsBar = memo(
	({ data, labels, bars, type = "default" }: LabelsBarProps) => {
		const [hide, setHide] = useState<string[]>([]);
		const onLegendClick = ({ value, inactive }: LegendPayload) => {
			if (!value) {
				return;
			}
			setHide((v) => (inactive ? v.filter((i) => i !== value) : [...v, value]));
		};
	
		return (
			<AspectRatio ratio={16 / 9}>
				<ResponsiveContainer>
					<BarChart responsive data={data}>
						<XAxis dataKey="date" />
						<YAxis />
						<Tooltip content={TooltipContentBar} />
						<Legend
							verticalAlign="top"
							formatter={(value, { color, inactive }) =>
								inactive ? (
									<span
										style={{
											color,
											textDecoration: "line-through",
										}}
									>
										{value}
									</span>
								) : (
									<span>{value}</span>
								)
							}
							onClick={onLegendClick}
						/>

						{bars.map((bar, index) => (
							<Bar
								key={bar}
								stackId={type === "stack" ? "a" : undefined}
								dataKey={bar}
								hide={hide.includes(bar)}
								fill={randomColorLabel(bar)}
								background
							/>
						))}
					</BarChart>
				</ResponsiveContainer>
			</AspectRatio>
		);
	},
);

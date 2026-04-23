import { randomColorLabel } from "@/entites/labels";
import { AspectRatio, Box, NumberFormatter } from "@mantine/core";
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
	type TooltipContentProps,
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
						<Tooltip
							content={({
								active,
								payload,
								separator,
								label,
							}: TooltipContentProps) => {
								if (active && payload && payload.length) {
									return (
										<Box
											bg="var(--mantine-color-body)"
											bd="1px solid var(--mantine-color-default-border)"
											p="xs"
										>
											<p>{label}</p>
											<p>
												Всего{separator}{" "}
												<NumberFormatter
													value={payload.reduce(
														(acc, { value }) => acc + value,
														0,
													)}
												/>
											</p>
											{payload.map(({ color, name, value, hide }) => (
												<p
													key={name}
													style={{
														color,
														textDecoration: hide ? "line-through" : undefined,
													}}
												>
													{name} {separator} <NumberFormatter value={value} />
												</p>
											))}
										</Box>
									);
								}
								return null;
							}}
						/>
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

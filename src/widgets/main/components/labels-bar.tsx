import { randomColorLabel } from "@/entites/labels";
import { $setting } from "@/shared";
import { LabelFormat } from "@/shared/ui";
import { AspectRatio } from "@mantine/core";
import dayjs from "dayjs";
import { memo, useEffect, useRef, useState } from "react";
import {
	Bar,
	BarChart,
	Brush,
	Legend,
	ReferenceArea,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
	type LegendPayload,
	type MouseHandlerDataParam,
	type TooltipContentProps,
	type TooltipIndex,
} from "recharts";

export interface LabelsBarProps {
	type?: "stack" | "default";
	data: Array<{
		date: string;
		total: number;
		[key: string]: string | number;
	}>;
	labels: string[];
	bars: string[];
}

export const LabelsBar = memo(
	({ data, labels, bars, type = "default" }: LabelsBarProps) => {
		const [hide, setHide] = useState<string[]>([]);
		const onLegendClick = ({ value, inactive }: LegendPayload) => {
			if (!value) {
				return;
			}
			setHide((v) => (inactive ? v.filter((i) => i !== value) : [...v, value]));
		};

		const refActive = useRef(false);
		const [{ startIndex, endIndex }, setIndex] = useState<{
			startIndex?: number | TooltipIndex;
			endIndex?: number | TooltipIndex;
		}>({
			startIndex: 0,
			endIndex: labels.length - 1,
		});
		const [rect, setRect] = useState<{
			left?: number | TooltipIndex;
			right?: number | TooltipIndex;
			show?: boolean;
		}>({
			left: 0,
			right: 0,
			show: false,
		});

		const handleMouseDown = ({ activeIndex }: MouseHandlerDataParam) => {
			setRect({
				left: activeIndex,
				show: true,
			});
			refActive.current = true;
		};
		const handleMouseMove = ({ activeIndex }: MouseHandlerDataParam) => {
			if (!refActive.current) {
				return;
			}
			setRect((v) => ({
				...v,
				right: activeIndex,
			}));
		};
		const handleMouseUp = ({ activeIndex }: MouseHandlerDataParam) => {
			if (!refActive.current) {
				return;
			}
			setRect((v) => ({
				...v,
				right: activeIndex,
				show: false,
			}));
			refActive.current = false;
		};

		useEffect(() => {
			if (!rect.show) {
				setIndex({
					startIndex: Math.min(
						(rect.left as number) || 0,
						(rect.right as number) || (rect.left as number) || 0,
					),
					endIndex: Math.max(
						(rect.left as number) || 0,
						(rect.right as number) || (rect.left as number) || 0,
					),
				});
			}
		}, [rect.show]);

		useEffect(() => {
			setIndex({
				startIndex: 0,
				endIndex: labels.length - 1,
			});
		}, [labels]);

		return (
			<AspectRatio ratio={16 / 9}>
				<ResponsiveContainer>
					<BarChart
						responsive
						data={data}
						onMouseDown={handleMouseDown}
						onMouseMove={handleMouseMove}
						onMouseUp={handleMouseUp}
					>
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
										<div
											style={{
												backgroundColor: "white",
												border: "1px solid #ccc",
												padding: "0.5em 1em",
											}}
										>
											<p>{dayjs(label).format($setting.get("formatDate"))}</p>
											<p>
												Всего{separator}{" "}
												{payload.reduce((acc, { value }) => acc + value, 0)}
											</p>
											{payload.map(({ color, name, value, hide }) => (
												<p
													key={name}
													style={{
														color,
														textDecoration: hide ? "line-through" : undefined,
													}}
												>
													{name} {separator} {value}
												</p>
											))}
										</div>
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
										<LabelFormat>{value}</LabelFormat>
									</span>
								) : (
									<span>
										<LabelFormat>{value}</LabelFormat>
									</span>
								)
							}
							onClick={onLegendClick}
						/>

						{rect.show ? (
							<ReferenceArea
								x1={
									labels[Math.min(rect.left || 0, rect.right || rect.left || 0)]
								}
								x2={
									labels[Math.max(rect.left || 0, rect.right || rect.left || 0)]
								}
								strokeOpacity={0.3}
							/>
						) : null}
						<Brush
							dataKey="date"
							height={20}
							startIndex={startIndex}
							endIndex={endIndex}
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

import { useQueryAnalytics } from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { randomColorLabel } from "@/entites/labels";
import { LabelFormat, Widget, type WidgetProps } from "@/shared/ui";
import { AspectRatio, Center, Checkbox, Group, Stack } from "@mantine/core";
import dayjs from "dayjs";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
	type TooltipContentProps,
} from "recharts";

const stepLabel = {
	s: "секундам",
	m: "минутам",
	h: "часам",
	d: "дням",
	mon: "месяцам",
	y: "годам",
};

export interface WidgetMainTypeProps
	extends Omit<WidgetProps, "children">, Omit<IRequestAnalytics, "event"> {
	filterdate: IRequestAnalytics["filterdate"];
	type: "stack" | "default";
}

export const WidgetMainType = memo(
	({
		filterdate,
		step = "d",
		type = "default",
		...props
	}: WidgetMainTypeProps) => {
		const { production_id } = useStoreUserProfile();

		const { isLoading, fetch, data, error } = useQueryAnalytics({
			filterdate,
			step,
			event: "p",
		});

		const [filterGap, setFilterGap] = useState<boolean>(true);
		const formatName = useCallback<(v: string) => string>(
			(name: string): string => {
				name = (name || "").toUpperCase().replace(/\.[^A-Z^a-z]*/g, "");
				return filterGap ? (name.split("G")[0] as string) : name;
			},
			[filterGap],
		);
		// Извлекаем список дат
		const labels = useMemo<string[]>(() => {
			const cnt = dayjs(filterdate[1]).diff(filterdate[0], "d");
			const labels: string[] = [];
			const d = dayjs(filterdate[0]);
			for (let i = 0; i <= cnt; i++) {
				labels.push(d.add(i, "d").format("YYYY-MM-DD"));
			}
			return labels;
		}, [filterdate]);

		// Извлекаем, групируем данные
		const ddata = useMemo(() => {
			let ddata = [];
			const currProduction = Number(production_id || 0);
			for (const date of labels) {
				const el: Record<string, any> = {
					date,
				};
				for (const prod of data.production) {
					if (currProduction > 0 && currProduction !== prod.production_id) {
						continue;
					}
					for (const item of prod.data) {
						if (
							dayjs(item.timestamp).format("YYYY-MM-DD") === date &&
							item.data.length < 18
						) {
							const label = formatName(item.data);
							if (!label) {
								continue;
							}
							el[label] = (el[label] || 0) + item.count;
						}
					}
				}
				ddata.push(el);
			}
			return ddata;
			return ddata.filter(({ date, ...data }) => Object.keys(data).length > 0);
		}, [data, labels, production_id, formatName]);

		const bars = useMemo(() => {
			const bars = [];
			for (const { date, ...el } of ddata) {
				bars.push(...Object.keys(el));
			}
			return [...new Set(bars)];
		}, [ddata]);

		const isEmpty = useMemo(() => !ddata.length, [bars]);

		useEffect(() => {
			fetch();
		}, [filterdate, step]);

		const [hide, setHide] = useState<string[]>([]);
		const onLegendClick = ({ value, inactive }: LegendPayload) => {
			if (!value) {
				return;
			}
			setHide((v) => (inactive ? v.filter((i) => i !== value) : [...v, value]));
		};

		const refActive = useRef(false);

		const [{ startIndex, endIndex }, setIndex] = useState<{
			startIndex: number;
			endIndex: number;
		}>({
			startIndex: 0,
			endIndex: labels.length - 1,
		});
		const [rect, setRect] = useState<{
			left?: number;
			right?: number;
			show?: boolean;
		}>({
			left: 0,
			right: 0,
			show: false,
		});

		const handleMouseDown = (...args) => {
			setRect({
				left: args[0].activeIndex,
				show: true,
			});
			refActive.current = true;
		};

		const handleMouseMove = (...args) => {
			if (!refActive.current) {
				return;
			}
			setRect((v) => ({
				...v,
				right: args[0].activeIndex,
			}));
		};

		const handleMouseUp = (...args) => {
			if (!refActive.current) {
				return;
			}
			setRect((v) => ({
				...v,
				right: args[0].activeIndex,
				show: false,
			}));
			refActive.current = false;
		};

		useEffect(() => {
			if (!rect.show) {
				setIndex({
					startIndex: Math.min(rect.left || 0, rect.right || rect.left || 0),
					endIndex: Math.max(rect.left || 0, rect.right || rect.left || 0),
				});
			}
		}, [rect.show]);

		return (
			<Widget
				error={error}
				{...props}
				loading={isLoading}
				title={`Напечатано за ${filterdate[0]}-${filterdate[1]} по ${stepLabel[step]}`}
			>
				<Stack h="100%">
					<Group gap="0" justify="flex-end">
						<Checkbox
							onChange={(e) => setFilterGap(e.target.checked)}
							checked={filterGap}
							label="Группировать по G"
						/>
					</Group>
					<AspectRatio ratio={16 / 9}>
						{isEmpty ? (
							<Center w="100%" h="100%" fz="h1" c="dimmed">
								Данные ненашлись!
							</Center>
						) : (
							<ResponsiveContainer>
								<BarChart
									responsive
									data={ddata}
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
														<p>
															Всего{separator}{" "}
															{payload.reduce(
																(acc, { value }) => acc + value,
																0,
															)}
														</p>
														{payload.map(({ color, name, value, hide }) => (
															<p
																key={name}
																style={{
																	color,
																	textDecoration: hide
																		? "line-through"
																		: undefined,
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
												labels[
													Math.min(rect.left || 0, rect.right || rect.left || 0)
												]
											}
											x2={
												labels[
													Math.max(rect.left || 0, rect.right || rect.left || 0)
												]
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
						)}
					</AspectRatio>
				</Stack>
			</Widget>
		);
	},
);

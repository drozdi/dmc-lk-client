import {
	useEnumsEvents,
	useEnumsStep,
	useQueryAnalytics,
} from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { randomColorLabel } from "@/entites/labels";
import { $setting } from "@/shared";
import {
	AspectRatio,
	Box,
	Center,
	NumberFormatter,
	Stack,
} from "@mantine/core";
import type { DateValue } from "@mantine/dates";
import dayjs from "dayjs";
import { memo, useEffect, useMemo, useState } from "react";
import {
	Bar,
	BarChart,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
	type BarShapeProps,
	type MouseHandlerDataParam,
	type TooltipContentProps,
} from "recharts";
import { useLabels } from "./hooks";
import { corectQuery } from "./utils";

type Element = Record<AnalyticEvent, number>;

export interface MainItogAnalyticsProps extends Partial<IRequestAnalytics> {
	filterdate: IRequestAnalytics["filterdate"];
	onChange?: (query: IRequestAnalytics) => void;
	lines?: AnalyticEvent[];
	stop?: SliceStep;
}

const ee = useEnumsEvents();
const es = useEnumsStep();

const ititValue = Object.fromEntries(
	Object.keys(ee.data).map((item) => [item, 0]),
);

const CustomNestedBar = (props: BarShapeProps) => {
	const { x, y, width, height, payload, fill } = props;
	const { total, v } = payload;
	const totalHeight = (height / v) * total;
	const gap = Math.min(16, width * 0.25);

	return (
		<g>
			<rect
				x={x}
				y={y - (totalHeight - height)}
				width={width}
				height={totalHeight}
				fill={randomColorLabel("def")}
			/>
			<rect
				x={x + gap}
				y={y}
				width={width - 2 * gap}
				height={height}
				fill={fill}
			/>
		</g>
	);
};

const CustomNestedBar1 = (props: BarShapeProps) => {
	const { x, y, width, height, fill } = props;
	const gap = Math.min(16, width * 0.25);

	return (
		<g>
			<rect
				x={x + gap}
				y={y}
				width={width - 2 * gap}
				height={height}
				fill={fill}
			/>
		</g>
	);
};

export const MainItogAnalytics = memo(
	({
		filterdate,
		stop = "m",
		lines = ["d", "v"],
		onChange,
	}: MainItogAnalyticsProps) => {
		const { production_id } = useStoreUserProfile();
		const [query, setQuery] = useState<IRequestAnalytics>(
			corectQuery({ filterdate } as IRequestAnalytics),
		);
		const { isLoading, fetch } = useQueryAnalytics(query);

		const [data, setData] =
			useState<Record<AnalyticEvent, IResponseAnalytics>>();

		useEffect(() => {
			(async function () {
				setData({
					v: (await fetch(
						corectQuery({ ...query, event: "v" }),
					)) as IResponseAnalytics,
					d: (await fetch(
						corectQuery({ ...query, event: "d" }),
					)) as IResponseAnalytics,
					p: (await fetch(
						corectQuery({ ...query, event: "p" }),
					)) as IResponseAnalytics,
					i: (await fetch(
						corectQuery({ ...query, event: "i" }),
					)) as IResponseAnalytics,
				});
			})();
			onChange?.(query);
		}, [query, onChange]);

		useEffect(() => {
			setQuery((prev) => corectQuery({ ...prev, filterdate }));
		}, [filterdate]);

		const labels = useLabels(query);

		// Извлекаем, групируем данные
		const ddata = useMemo(() => {
			if (!data) {
				return [];
			}
			const step = query.step === "mon" ? "M" : query.step;
			const currProduction = Number(production_id || 0);
			const ddata: Record<string, Element> = {};

			for (const date of labels) {
				ddata[date] = ddata[date] || ({ ...ititValue } as Element);

				for (const event in data) {
					for (const production of data[event as AnalyticEvent]?.production ||
						[]) {
						if (
							currProduction > 0 &&
							production.production_id !== currProduction
						) {
							continue;
						}

						for (const item of production.data) {
							if (step === "s") {
								if (dayjs(item.timestamp).format("ss") === date) {
									ddata[date][event as AnalyticEvent] += item.count;
								}
							} else if (step === "m") {
								if (dayjs(item.timestamp).format("mm") === date) {
									ddata[date][event as AnalyticEvent] += item.count;
								}
							} else if (step === "h") {
								if (dayjs(item.timestamp).format("HH") === date) {
									ddata[date][event as AnalyticEvent] += item.count;
								}
							} else {
								if (dayjs(item.timestamp).format("YYYY-MM-DD") === date) {
									ddata[date][event as AnalyticEvent] += item.count;
								}
							}
						}
					}
				}
			}
			return Object.entries(ddata)
				.map(([date, data]) => ({
					...data,
					date,
				}))
				.map((item) => ({
					...item,
					total: lines.reduce((acc, key) => acc + item[key] || 0, 0),
				}));
		}, [data, labels, query.step]);

		const middle = useMemo(
			() => Math.round(data?.v?.average_company || 0),
			[data],
		);

		const bars = useMemo(() => {
			const bars = [];
			for (const { date, ...el } of ddata) {
				bars.push(...Object.keys(el));
			}
			return [...new Set(bars)];
		}, [ddata]);

		const isEmpty = useMemo(() => !ddata.length, [bars]);

		const handleClick = (arg: MouseHandlerDataParam, e: React.MouseEvent) => {
			if (query.step === stop) {
				return;
			}
			const step =
				query.step === "y"
					? "mon"
					: query.step === "mon"
						? "w"
						: query.step === "w"
							? "d"
							: query.step === "d"
								? "h"
								: query.step === "h"
									? "m"
									: "s";

			const filterdate: [DateValue, DateValue] = ["", ""];

			if (step === "s") {
				const d = dayjs(query.filterdate[0]).minute(Number(arg.activeLabel));
				filterdate[0] = d.startOf("s").format("YYYY-MM-DD HH:mm:00");
				filterdate[1] = d.endOf("s").format("YYYY-MM-DD HH:mm:59");
			} else if (step === "m") {
				const d = dayjs(query.filterdate[0]).hour(Number(arg.activeLabel));
				filterdate[0] = d.startOf("h").format("YYYY-MM-DD HH:mm:ss");
				filterdate[1] = d.endOf("h").format("YYYY-MM-DD HH:mm:ss");
			} else if (step === "h") {
				filterdate[0] = dayjs(arg.activeLabel)
					.startOf("d")
					.format("YYYY-MM-DD HH:mm:ss");
				filterdate[1] = dayjs(arg.activeLabel)
					.endOf("d")
					.format("YYYY-MM-DD HH:mm:ss");
			} else if (step === "d") {
				filterdate[0] = dayjs(arg.activeLabel)
					.startOf("w")
					.format("YYYY-MM-DD");
				filterdate[1] = dayjs(arg.activeLabel).endOf("w").format("YYYY-MM-DD");
			} else if (step === "w") {
				filterdate[0] = dayjs(arg.activeLabel)
					.startOf("M")
					.format("YYYY-MM-DD");
				filterdate[1] = dayjs(arg.activeLabel).endOf("M").format("YYYY-MM-DD");
			} else if (step === "mon") {
				filterdate[0] = dayjs(arg.activeLabel)
					.startOf("y")
					.format("YYYY-MM-DD");
				filterdate[1] = dayjs(arg.activeLabel).endOf("y").format("YYYY-MM-DD");
			}
			setQuery(corectQuery({ ...query, filterdate, step }));
		};

		return (
			<Stack h="100%">
				<AspectRatio ratio={16 / 9}>
					{isEmpty ? (
						<Center w="100%" h="100%" fz="h1" c="dimmed">
							Данные ненашлись!
						</Center>
					) : (
						<ResponsiveContainer>
							<BarChart
								responsive
								stackOffset="positive"
								data={ddata}
								onClick={handleClick}
							>
								<XAxis
									dataKey="date"
									tickFormatter={(date) => {
										if (
											query.step === "s" ||
											query.step === "m" ||
											query.step === "h"
										) {
											return date;
										}
										return dayjs(date).format($setting.get("formatDate"));
									}}
								/>
								<YAxis />
								<Tooltip
									content={(arg: TooltipContentProps) => {
										const { label, active, payload, separator, activeIndex } =
											arg;
										if (active && payload && payload.length) {
											return (
												<Box
													bg="var(--mantine-color-body)"
													bd="1px solid var(--mantine-color-default-border)"
													p="xs"
												>
													<p>
														{["s", "m", "h"].includes(query.step)
															? label
															: dayjs(label).format($setting.get("formatDate"))}
													</p>
													<p>
														Всего {separator}{" "}
														<NumberFormatter
															value={ddata[activeIndex].total as number}
														/>
													</p>
													{lines.map((name) => (
														<p
															key={name}
															style={{
																color: ee.findColorByCode(name),
															}}
														>
															{ee.findLabelByCode(name)} {separator}{" "}
															<NumberFormatter
																value={ddata[activeIndex][name] as number}
															/>
														</p>
													))}
												</Box>
											);
										}
										return null;
									}}
								/>

								{middle > 0 && (
									<ReferenceLine
										y={middle}
										stroke="red"
										strokeDasharray="3 3"
									/>
								)}
								<Bar
									dataKey="v"
									stackId="a"
									name={ee.findLabelByCode("v")}
									fill={ee.findColorByCode("v")}
									background
									shape={CustomNestedBar}
								/>
								<Bar
									dataKey="d"
									stackId="a"
									name={ee.findLabelByCode("d")}
									fill={ee.findColorByCode("d")}
									shape={CustomNestedBar1}
								/>
							</BarChart>
						</ResponsiveContainer>
					)}
				</AspectRatio>
			</Stack>
		);
	},
);

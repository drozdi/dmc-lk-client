import { useStoreUserProfile } from "@/entites/auth";
import { randomColorLabel } from "@/entites/labels";
import { $setting } from "@/shared";
import { Widget, type WidgetProps } from "@/shared/ui";
import {
	AspectRatio,
	Box,
	Center,
	NumberFormatter,
	Stack,
} from "@mantine/core";
import type { DateValue } from "@mantine/dates";
import dayjs from "dayjs";
import { memo, useEffect, useMemo } from "react";
import { TbReload } from "react-icons/tb";
import {
	Bar,
	BarChart,
	Brush,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
	type MouseHandlerDataParam,
	type TooltipContentProps,
} from "recharts";
import { useAnalytics } from "./hooks/use-analytics";

const stepLabel = {
	s: "секундам",
	m: "минутам",
	h: "часам",
	d: "дням",
	w: "неделям",
	mon: "месяцам",
	y: "годам",
};

export interface WidgetMainItogAnalyticsProps
	extends Omit<WidgetProps, "children">, Partial<IRequestAnalytics> {
	filterdate: IRequestAnalytics["filterdate"];
	onChange?: (filterdate: IRequestAnalytics) => void;
}

export const WidgetMainItogAnalytics = memo(
	({
		filterdate,
		event = "p",
		onChange,
		...props
	}: WidgetMainItogAnalyticsProps) => {
		const { production_id } = useStoreUserProfile();

		const { isLoading, fetch, data, error, query, reset } = useAnalytics(
			{
				filterdate,
				event,
			},
			onChange,
		);

		// Извлекаем список дат
		const labels = useMemo<string[]>(() => {
			const step = query.step === "mon" ? "M" : query.step;
			const s = dayjs(query.filterdate[0]).startOf(step);
			const e = dayjs(query.filterdate[1]).startOf(step);
			const cnt = dayjs(e).diff(s, step);
			const labels: string[] = [];
			for (let i = 0; i <= cnt; i++) {
				if (step === "h") {
					labels.push(s.add(i, "h").format("HH"));
				} else if (step === "m") {
					labels.push(s.add(i, "m").format("mm"));
				} else {
					labels.push(s.add(i, step).format("YYYY-MM-DD"));
				}
			}
			return labels;
		}, [query.filterdate, query.step]);

		// Извлекаем, групируем данные
		const ddata = useMemo(() => {
			const step = query.step === "mon" ? "M" : query.step;
			let ddata = [];
			for (const date of labels) {
				const el: {
					date: string;
					data: number;
				} = {
					date,
					data: 0,
				};
				for (const prod of data.production) {
					for (const item of prod.data) {
						if (step === "m") {
							if (dayjs(item.timestamp).format("mm") === date) {
								el.data += item.count;
							}
						} else if (step === "h") {
							if (dayjs(item.timestamp).format("HH") === date) {
								el.data += item.count;
							}
						} else {
							if (dayjs(item.timestamp).format("YYYY-MM-DD") === date) {
								el.data += item.count;
							}
						}
					}
				}
				ddata.push(el);
			}
			return ddata;
		}, [data, labels, query.step]);

		const middle = useMemo(() => Math.round(data.average_company) || 0, [data]);

		const bars = useMemo(() => {
			const bars = [];
			for (const { date, ...el } of ddata) {
				bars.push(...Object.keys(el));
			}
			return [...new Set(bars)];
		}, [ddata]);

		const isEmpty = useMemo(() => !ddata.length, [bars]);

		useEffect(() => {
			fetch({
				filterdate,
				event,
			});
		}, [filterdate, event]);

		const handleClick = (arg: MouseHandlerDataParam, e: React.MouseEvent) => {
			const target = e.target as HTMLElement;
			if (query.step === "s" || target?.closest(".recharts-brush")) {
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

			fetch({
				filterdate,
				step,
			});
		};

		return (
			<Widget
				error={error}
				loading={isLoading}
				{...props}
				title={`Работа за ${dayjs(query.filterdate[0]).format($setting.get("formatDate"))}-${dayjs(query.filterdate[1]).format($setting.get("formatDate"))} по ${stepLabel[query.step]}`}
				menu={[
					{
						children: "Сбросить",
						onClick: () => {
							reset();
						},
						leftSection: <TbReload />,
					},
				]}
			>
				<Stack h="100%">
					<AspectRatio ratio={16 / 9}>
						{isEmpty ? (
							<Center w="100%" h="100%" fz="h1" c="dimmed">
								Данные ненашлись!
							</Center>
						) : (
							<ResponsiveContainer>
								<BarChart responsive data={ddata} onClick={handleClick}>
									<XAxis
										dataKey="date"
										// tickFormatter={(date) =>
										// 	query.step === "d"
										// 		? dayjs(date).format($setting.get("formatDate"))
										// 		: date
										// }
									/>
									<YAxis />
									<Tooltip
										content={({
											label,
											active,
											payload,
											separator,
										}: TooltipContentProps) => {
											if (active && payload && payload.length) {
												return (
													<Box
														bg="var(--mantine-color-body)"
														bd="1px solid var(--mantine-color-default-border)"
														p="xs"
													>
														<p>
															{query.step === "d"
																? dayjs(label).format(
																		$setting.get("formatDate"),
																	)
																: label}
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
																{name} {separator}{" "}
																<NumberFormatter
																	value={value as number}
																	thousandSeparator=" "
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

									<Brush
										dataKey="date"
										height={20}
										startIndex={0}
										endIndex={labels.length - 1}
									/>

									<Bar
										dataKey="data"
										name="Напечатано"
										fill={randomColorLabel("def")}
										background
									/>
								</BarChart>
							</ResponsiveContainer>
						)}
					</AspectRatio>
				</Stack>
			</Widget>
		);
	},
);

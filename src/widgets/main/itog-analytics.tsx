import { useQueryAnalytics } from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { randomColorLabel } from "@/entites/labels";
import { $setting } from "@/shared";
import { Widget, type WidgetProps } from "@/shared/ui";
import { AspectRatio, Center, NumberFormatter, Stack } from "@mantine/core";
import type { DateValue } from "@mantine/dates";
import dayjs from "dayjs";
import { memo, useEffect, useMemo, useState } from "react";
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

const stepLabel = {
	s: "секундам",
	m: "минутам",
	h: "часам",
	d: "дням",
	mon: "месяцам",
	y: "годам",
};

export interface WidgetMainItogAnalyticsProps
	extends Omit<WidgetProps, "children">, Partial<IRequestAnalytics> {
	filterdate: IRequestAnalytics["filterdate"];
}

export const WidgetMainItogAnalytics = memo(
	({
		filterdate,
		step = "d",
		event = "p",
		...props
	}: WidgetMainItogAnalyticsProps) => {
		const { production_id } = useStoreUserProfile();
		const [query, setQuery] = useState<IRequestAnalytics>({
			filterdate,
			step,
			event,
		});
		const { isLoading, fetch, data, error } = useQueryAnalytics(query);

		// Извлекаем список дат
		const labels = useMemo<string[]>(() => {
			const cnt = dayjs(query.filterdate[1]).diff(
				query.filterdate[0],
				query.step as any,
			);
			const labels: string[] = [];
			const d = dayjs(query.filterdate[0]);
			for (let i = 0; i <= cnt; i++) {
				if (query.step === "d") {
					labels.push(d.add(i, "d").format("YYYY-MM-DD"));
				} else if (query.step === "h") {
					labels.push(d.add(i, "h").format("HH"));
				}
			}
			return labels;
		}, [query.filterdate, query.step]);

		// Извлекаем, групируем данные
		const ddata = useMemo(() => {
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
						if (query.step === "d") {
							if (
								dayjs(item.timestamp).format("YYYY-MM-DD") === date &&
								item.data.length < 18
							) {
								el.data += item.count;
							}
						} else if (query.step === "h") {
							if (
								dayjs(item.timestamp).format("HH") === date &&
								item.data.length < 18
							) {
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
			fetch();
		}, [query]);
		useEffect(() => {
			setQuery((v) => ({
				...v,
				filterdate,
				step,
				event,
			}));
		}, [filterdate, step, event]);

		const handleClick = (arg: MouseHandlerDataParam, e: React.MouseEvent) => {
			const target = e.target as HTMLElement;
			if (query.step === "h" || target?.closest(".recharts-brush")) {
				return;
			}
			const filterdate: [DateValue, DateValue] = [
				arg.activeLabel as string,
				dayjs(arg.activeLabel).add(1, "d").format("YYYY-MM-DD"),
			];
			setQuery((v) => ({
				...v,
				filterdate,
				step: "h",
			}));
		};

		return (
			<Widget
				error={error}
				loading={isLoading}
				{...props}
				title={`Работа за ${dayjs(query.filterdate[0]).format($setting.get("formatDate"))}-${dayjs(query.filterdate[1]).format($setting.get("formatDate"))} по ${stepLabel[query.step]}`}
				menu={[
					{
						children: "Обновить",
						onClick: () => {
							setQuery({
								filterdate,
								step,
								event,
							});
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
										tickFormatter={(date) =>
											query.step === "d"
												? dayjs(date).format($setting.get("formatDate"))
												: date
										}
									/>
									<YAxis />
									<Tooltip
										content={(props: TooltipContentProps) => {
											//console.log(props);
											const { label, active, payload, separator } = props;
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
													</div>
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

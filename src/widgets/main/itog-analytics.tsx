import { useQueryAnalytics } from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { Widget, type WidgetProps } from "@/shared/ui";
import { cached, randomColor } from "@/shared/utils";
import { AspectRatio, Center, Stack } from "@mantine/core";
import type { DateValue } from "@mantine/dates";
import dayjs from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";
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
} from "recharts";

const colors = cached<string>((name: string) => randomColor());

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
	type: "stack" | "default";
}

export const WidgetMainItogAnalytics = ({
	filterdate,
	step = "d",
	event = "p",
	type = "default",
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

	const middle = useMemo(() => Math.round(data.average_company), [data]);

	console.log(middle);

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

	const [{ startIndex, endIndex }, setIndex] = useState<{
		startIndex: number;
		endIndex: number;
	}>({
		startIndex: 0,
		endIndex: labels.length - 1,
	});

	const handleClick = (arg: MouseHandlerDataParam) => {
		console.log(arg);
		console.log(ref);
		if (query.step === "h") {
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

	const ref = useRef<HTMLElement>(null);

	return (
		<Widget
			{...props}
			loading={isLoading}
			title={`Работа за ${query.filterdate[0]}-${query.filterdate[1]} по ${stepLabel[query.step]}`}
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
								<XAxis dataKey="date" />
								<YAxis />
								<Tooltip />

								<ReferenceLine y={middle} stroke="red" strokeDasharray="3 3" />

								<Brush
									dataKey="date"
									height={20}
									startIndex={startIndex}
									endIndex={endIndex}
									ref={ref}
								/>

								<Bar
									dataKey="data"
									label={event === "p" ? "Напечатано" : event}
								/>
							</BarChart>
						</ResponsiveContainer>
					)}
				</AspectRatio>
			</Stack>
		</Widget>
	);
};

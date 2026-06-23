import { AnalyticsEmpty, useAnalytics, useFilterdateStep } from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { $setting } from "@/shared";
import { labelName } from "@/shared/utils";
import { Checkbox, Group, Stack, Tooltip as MantineTooltip } from "@mantine/core";
import dayjs from "dayjs";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { LabelsBar } from "./ui/labels-bar";
import { LabelsTable } from "./ui/labels-table";

export interface AnalyticLabelsProps {
	filterdate: IRequestAnalytics["filterdate"];
	event?: IRequestAnalytics["event"];
	step?: IRequestAnalytics["step"];
	type: "stack" | "default" | "table";
	onLoaded?: (data: any) => void;
}

export const AnalyticLabels = memo(
	({
		filterdate,
		step = "d",
		event = "p",
		type = "default",
		onLoaded,
	}: AnalyticLabelsProps) => {
		const production_id = useStoreUserProfile((state) => state.productions)
		
		const { fetch, data, query } = useAnalytics({
			filterdate,
			step,
			event,
			production_id,
		});

		const [filterGap, setFilterGap] = useState<boolean>(true);

		const formatName = useCallback<(v: string) => string>(
			(name: string): string => {
				name = (name || "").toUpperCase().replace(/\.[^A-Z^a-z]*/g, "");
				return filterGap ? labelName(name) : name;
			},
			[filterGap],
		);

		// Извлекаем список дат
		const labels = useFilterdateStep(query);

		// Извлекаем, групируем данные
		const ddata = useMemo<
			Array<{
				date: string;
				total: number;
				[key: string]: string | number;
			}>
		>(() => {
			const ddata: Record<string, Record<string, number>> = {};
			for (const date of labels) {
				ddata[date] = ddata[date] || {
					total: 0,
				};
				for (const prod of data.production) {
					for (const item of prod.data) {
						if (item.data.length > 15) {
							continue;
						}
						let date = dayjs(item.timestamp).format("YYYY-MM-DD");
						if (query.step === "h") {
							date = dayjs(item.timestamp).format("HH");
						} else if (query.step === "m") {
							date = dayjs(item.timestamp).format("mm");
						} else if (query.step === "s") {
							date = dayjs(item.timestamp).format("ss");
						}
						if (!labels.includes(date)) {
							continue;
						}

						const label = formatName(item.data);
						ddata[date] = ddata[date] || {
							total: 0,
						};
						ddata[date][label] = (ddata[date][label] || 0) + item.count;
					}
				}
			}
			return Object.entries(ddata)
				.sort((a, b) => a[0].localeCompare(b[0]))
				.map(([date, v]) => ({
					...v,
					date,
					total: Object.values(v).reduce((a, b) => a + b, 0),
				}));
		}, [data, labels, production_id, formatName]);

		const bars = useMemo(() => {
			const bars = [];
			for (const { date, total, ...item } of ddata) {
				bars.push(...Object.keys(item));
			}
			return [...new Set(bars)];
		}, [ddata]);

		const isEmpty = useMemo(() => !ddata.length, [bars]);

		const formatData = useMemo(() => {
			return ddata
				.filter((v) => v.total > 0)
				.map((item) => {
					const date = ["s", "m", "h"].includes(query.step)
						? item.date
						: dayjs(item.date).format($setting.get("formatDate"));
					return {
						...item,
						date,
					};
				});
		}, [ddata, query.step]);

		useEffect(() => {
			fetch({
				filterdate,
				step,
			});
		}, [filterdate, step]);

		useEffect(() => {
			onLoaded?.(formatData)
		}, [onLoaded, formatData])


		return (
			<Stack h="100%">
				<Group gap="0" justify="flex-end">
					<MantineTooltip label='Учитывать зазор между этикетками'>
						<Checkbox
							onChange={(e) => setFilterGap(e.target.checked)}
							checked={filterGap}
							label="Группировать по Gap"
						/>
					</MantineTooltip>
				</Group>
				{isEmpty ? (
					<AnalyticsEmpty query={query} />
				) : type === "table" ? (
					<LabelsTable query={query} data={formatData} bars={bars} />
				) : (
					<LabelsBar
						query={query}
						type={type}
						data={formatData}
						bars={bars}
						labels={labels}
					/>
				)}
			</Stack>
		);
	},
);

import { useStoreUserProfile } from "@/entites/auth";
import { $setting } from "@/shared";
import { labelName } from "@/shared/utils";
import { Center, Checkbox, Group, Stack } from "@mantine/core";
import dayjs from "dayjs";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useAnalytics } from "./hooks";
import { LabelsBar } from "./ui/labels-bar";
import { LabelsTable } from "./ui/labels-table";

export interface MainLabelsProps {
	filterdate: IRequestAnalytics["filterdate"];
	event?: IRequestAnalytics["event"];
	step?: IRequestAnalytics["step"];
	type: "stack" | "default" | "table";
}

export const MainLabels = memo(
	({
		filterdate,
		step = "d",
		event = "p",
		type = "default",
	}: MainLabelsProps) => {
		const { production_id } = useStoreUserProfile();

		const { fetch, data, query } = useAnalytics({
			filterdate,
			step,
			event,
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
				} else if (step === "s") {
					labels.push(s.add(i, "s").format("ss"));
				} else {
					labels.push(s.add(i, step).format("YYYY-MM-DD"));
				}
			}
			return labels;
		}, [query.filterdate, query.step]);

		// Извлекаем, групируем данные
		const ddata = useMemo<
			Array<{
				date: string;
				total: number;
				[key: string]: string | number;
			}>
		>(() => {
			const ddata: Record<string, Record<string, number>> = {};
			const currProduction = Number(production_id || 0);

			for (const date of labels) {
				ddata[date] = ddata[date] || {
					total: 0,
				};
				for (const prod of data.production) {
					if (currProduction > 0 && currProduction !== prod.production_id) {
						continue;
					}
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

		return isEmpty ? (
			<Center w="100%" h="100%" fz="h1" c="dimmed">
				Данные ненашлись!
			</Center>
		) : type === "table" ? (
			<LabelsTable data={formatData} headers={bars} />
		) : (
			<Stack h="100%">
				<Group gap="0" justify="flex-end">
					<Checkbox
						onChange={(e) => setFilterGap(e.target.checked)}
						checked={filterGap}
						label="Группировать по G"
					/>
				</Group>
				<LabelsBar type={type} data={formatData} bars={bars} labels={labels} />
			</Stack>
		);
	},
);

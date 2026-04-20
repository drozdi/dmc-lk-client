import { useQueryAnalytics } from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { $setting } from "@/shared";
import { Widget, type WidgetProps } from "@/shared/ui";
import { labelName } from "@/shared/utils";
import { Center, Checkbox, Group, Stack } from "@mantine/core";
import dayjs from "dayjs";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { LabelsBar } from "./ui/labels-bar";
import { LabelsTable } from "./ui/labels-table";

const stepLabel = {
	s: "секундам",
	m: "минутам",
	h: "часам",
	d: "дням",
	mon: "месяцам",
	y: "годам",
};

export interface WidgetMainTypeProps extends Omit<
	WidgetProps,
	"children" | "title"
> {
	title?: WidgetProps["title"];
	filterdate: IRequestAnalytics["filterdate"];
	event?: IRequestAnalytics["event"];
	step?: IRequestAnalytics["step"];
	type: "stack" | "default" | "table";
}

export const WidgetMainLabels = memo(
	({
		title,
		filterdate,
		step = "d",
		event = "p",
		type = "default",
		...props
	}: WidgetMainTypeProps) => {
		const { production_id } = useStoreUserProfile();
		const [query, setQuery] = useState<IRequestAnalytics>({
			filterdate,
			step,
			event,
		});
		const { isLoading, fetch, data, error } = useQueryAnalytics(query);

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
			const cnt = dayjs(filterdate[1]).diff(filterdate[0], "d");
			const labels: string[] = [];
			const d = dayjs(filterdate[0]);
			for (let i = 0; i <= cnt; i++) {
				labels.push(d.add(i, "d").format("YYYY-MM-DD"));
			}
			return labels;
		}, [filterdate]);

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
						if (item.data.length > 12) {
							continue;
						}
						const date = dayjs(item.timestamp).format("YYYY-MM-DD");
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

		useEffect(() => {
			setQuery((v) => ({
				...v,
				filterdate,
				step,
			}));
		}, [filterdate, step]);

		useEffect(() => {
			fetch();
		}, [query]);

		const computedTitle = useMemo(() => {
			if (title) {
				return title;
			}
			if (event === "d") {
				return "Дефект";
			} else if (event === "i") {
				return "Инциденты";
			} else if (event === "v") {
				return "Проверенно";
			}
			return "Напечатано";
		}, [title, event]);

		return (
			<Widget
				error={error}
				loading={isLoading}
				{...props}
				title={computedTitle}
				subTitle={`${dayjs(query.filterdate[0]).format($setting.get("formatDate"))} - ${dayjs(query.filterdate[1]).format($setting.get("formatDate"))}`}
			>
				{isEmpty ? (
					<Center w="100%" h="100%" fz="h1" c="dimmed">
						Данные ненашлись!
					</Center>
				) : type === "table" ? (
					<LabelsTable data={ddata} headers={bars} />
				) : (
					<Stack h="100%">
						<Group gap="0" justify="flex-end">
							<Checkbox
								onChange={(e) => setFilterGap(e.target.checked)}
								checked={filterGap}
								label="Группировать по G"
							/>
						</Group>
						<LabelsBar type={type} data={ddata} bars={bars} labels={labels} />
					</Stack>
				)}
			</Widget>
		);
	},
);

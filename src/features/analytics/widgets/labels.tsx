import {
	AnalyticsEmpty,
	formatTimestampByStep,
	useAnalytics,
	useFilterdateStep,
} from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { $setting } from "@/shared";
import { ChartSkeleton } from "@/shared/ui/skeleton";
import { Stack } from "@mantine/core";
import dayjs from "dayjs";
import { memo, useEffect, useMemo } from "react";
import { useLabelFormatName } from "../hooks/use-label-format-name";
import { LabelGapToggle } from "../ui/label-gap-toggle";
import { LabelsBar } from "./ui/labels-bar";
import { LabelsTable } from "./ui/labels-table";

export interface AnalyticLabelsProps {
	filterdate: IRequestAnalytics["filterdate"];
	event?: IRequestAnalytics["event"];
	step?: IRequestAnalytics["step"];
	type: "stack" | "default" | "table";
	onLoaded?: (data: any) => void;
}

function buildLabelsDataIndex(
	data: IResponseAnalytics | undefined,
	step: SliceStep,
	formatName: (name: string) => string,
): Map<string, Map<string, number>> {
	const index = new Map<string, Map<string, number>>();

	for (const prod of data?.production || []) {
		for (const item of prod.data) {
			if (item.data.length > 15) {
				continue;
			}
			const itemDate = formatTimestampByStep(item.timestamp, step);
			const label = formatName(item.data);
			const dateMap = index.get(itemDate) ?? new Map<string, number>();
			dateMap.set(label, (dateMap.get(label) ?? 0) + item.count);
			index.set(itemDate, dateMap);
		}
	}

	return index;
}

export const AnalyticLabels = memo(
	({
		filterdate,
		step = "d",
		event = "p",
		type = "default",
		onLoaded,
	}: AnalyticLabelsProps) => {
		const production_id = useStoreUserProfile((state) => state.productions);

		const { data, query, isLoading, isFetching } = useAnalytics({
			filterdate,
			step,
			event,
			production_id,
		});

		const { filterGap, setFilterGap, formatName } = useLabelFormatName(true);

		const labels = useFilterdateStep(query);
		const hasData = !!data?.production?.length;

		const ddata = useMemo(() => {
			const index = buildLabelsDataIndex(data, query.step, formatName);

			return labels
				.map((date) => {
					const dateMap = index.get(date);
					const row: Record<string, string | number> = { date, total: 0 };
					if (dateMap) {
						for (const [label, count] of dateMap) {
							row[label] = count;
							row.total = (row.total as number) + count;
						}
					}
					return row as {
						date: string;
						total: number;
						[key: string]: string | number;
					};
				})
				.sort((a, b) => a.date.localeCompare(b.date));
		}, [data, labels, query.step, formatName]);

		const bars = useMemo(() => {
			const barSet = new Set<string>();
			for (const { date, total, ...item } of ddata) {
				for (const key of Object.keys(item)) {
					barSet.add(key);
				}
			}
			return [...barSet];
		}, [ddata]);

		const isEmpty = useMemo(() => !ddata.length, [ddata]);

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
			onLoaded?.(formatData);
		}, [onLoaded, formatData]);

		const showSkeleton = (isLoading || isFetching) && !hasData;

		return (
			<Stack h="100%">
				<LabelGapToggle checked={filterGap} onChange={setFilterGap} />
				{showSkeleton ? (
					<ChartSkeleton height="100%" mih={180} />
				) : isEmpty ? (
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

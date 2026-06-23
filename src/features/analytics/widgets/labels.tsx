import {
	AnalyticsEmpty,
	formatTimestampByStep,
	useAnalytics,
	useFilterdateStep,
} from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { $setting } from "@/shared";
import { labelName } from "@/shared/utils";
import { ChartSkeleton } from "@/shared/ui/skeleton";
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

		const { data, query, isLoading, isFetching } = useAnalytics({
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

		const labels = useFilterdateStep(query);
		const hasData = !!data?.production?.length;

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
						const itemDate = formatTimestampByStep(
							item.timestamp,
							query.step,
						);
						if (!labels.includes(itemDate)) {
							continue;
						}

						const label = formatName(item.data);
						ddata[itemDate] = ddata[itemDate] || {
							total: 0,
						};
						ddata[itemDate][label] = (ddata[itemDate][label] || 0) + item.count;
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
		}, [data, labels, query.step, formatName]);

		const bars = useMemo(() => {
			const bars = [];
			for (const { date, total, ...item } of ddata) {
				bars.push(...Object.keys(item));
			}
			return [...new Set(bars)];
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
			onLoaded?.(formatData)
		}, [onLoaded, formatData])

		const showSkeleton = (isLoading || isFetching) && !hasData;

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

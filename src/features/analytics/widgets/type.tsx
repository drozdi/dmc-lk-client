import { AnalyticsEmpty, useAnalytics } from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { randomColorLabel } from "@/entites/labels";
import { labelName } from "@/shared/utils";
import { ChartSkeleton } from "@/shared/ui/skeleton";
import { AspectRatio, Checkbox, Group, Stack, Tooltip } from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import { TypeBar } from "./ui/type-bar";

export interface AnalyticTypeProps {
	filterdate: IRequestAnalytics["filterdate"];
	step?: IRequestAnalytics["step"];
	event?: IRequestAnalytics["event"];
}

export const AnalyticType = ({
	filterdate,
	step = "d",
	event = "p",
}: AnalyticTypeProps) => {
	const productions = useStoreUserProfile((state) => state.productions);

	const { data, query, isLoading, isFetching } = useAnalytics({
		filterdate,
		step,
		event,
		production_id: productions,
	});

	const [filterGap, setFilterGap] = useState<boolean>(true);

	const formatName = useCallback<(v: string) => string>(
		(name: string) => {
			name = (name || "").toUpperCase().replace(/\.[^A-Z^a-z]*/g, "");
			return filterGap ? labelName(name) : name;
		},
		[filterGap],
	);

	const labels = useMemo<string[]>(() => {
		let res: string[] = [];
		if (data) {
			for (const p of data?.production || []) {
				res = res.concat(
					((p.data as any) || [])
						.filter((item: IAnalyticsDataItem) => item.data.length < 12)
						.map((item: IAnalyticsDataItem) => formatName(item.data)),
				);
			}
		}
		return [...new Set(res)].sort();
	}, [data, formatName]);

	const ddata = useMemo<
		Array<{
			name: string;
			value: number;
			color: string;
		}>
	>(() => {
		const ddata: Record<
			string,
			{
				name: string;
				value: number;
				color: string;
			}
		> = {};
		for (const label of labels) {
			ddata[label] = {
				name: label,
				value: 0,
				color: randomColorLabel(label),
			};
		}
		for (const production of data.production) {
			for (const item of production.data) {
				if (item.data.length > 11) {
					continue;
				}
				const label = formatName(item.data);
				ddata[label] = ddata[label] || {
					name: label,
					value: 0,
					color: randomColorLabel(label),
				};
				ddata[label].value += item.count;
			}
		}
		return Object.values(ddata);
	}, [data, labels]);

	const isEmpty = useMemo(() => !ddata.some(({ value }) => value > 0), [ddata]);
	const showSkeleton = (isLoading || isFetching) && !data?.production?.length;

	return (
		<Stack h="100%">
			<Group gap="0" justify="flex-end">
				<Tooltip label='Учитывать зазор между этикетками'>
					<Checkbox
						onChange={(e) => setFilterGap(e.target.checked)}
						checked={filterGap}
						label="Группировать по Gap"
					/>
					</Tooltip>
			</Group>
			<AspectRatio ratio={16 / 9}>
				{showSkeleton ? (
					<ChartSkeleton height="100%" mih={180} />
				) : isEmpty ? (
					<AnalyticsEmpty query={query} />
				) : (
					<TypeBar data={ddata} bars={labels} />
				)}
			</AspectRatio>
		</Stack>
	);
};

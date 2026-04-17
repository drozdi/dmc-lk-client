import { useQueryAnalytics } from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { randomColorLabel } from "@/entites/labels";
import { Widget, type WidgetProps } from "@/shared/ui";
import { labelName } from "@/shared/utils";
import { AspectRatio, Center, Checkbox, Group, Stack } from "@mantine/core";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Filterdate } from "./components/filterdate";
import { TypeBar } from "./components/type-bar";

export interface WidgetLabelsTypeProps extends WidgetProps {
	filterdate: IRequestAnalytics["filterdate"];
	step: IRequestAnalytics["step"];
	event: IRequestAnalytics["event"];
}

export const WidgetLabelsType = memo(
	({
		filterdate,
		step = "d",
		event = "p",
		...props
	}: WidgetLabelsTypeProps) => {
		const { production_id } = useStoreUserProfile();
		// return "";
		const [query, setQuery] = useState<IRequestAnalytics>({
			filterdate,
			step,
			event,
		});
		const { isLoading, fetch, data } = useQueryAnalytics(query);
		const [filterGap, setFilterGap] = useState<boolean>(true);

		const formatName = useCallback<(v: string) => string>(
			(name: string) => {
				name = (name || "").toUpperCase().replace(/\.[^A-Z^a-z]*/g, "");
				return filterGap ? labelName(name) : name;
			},
			[filterGap],
		);

		// Извлекаем список дат
		const labels = useMemo<string[]>(() => {
			let res: string[] = [];
			if (data) {
				for (const p of data?.production || []) {
					res = res.concat(
						((p.data as any) || [])
							.filter((item) => item.data.length < 12)
							.map((item: IAnalyticsDataItem) => formatName(item.data)),
					);
				}
			}
			return [...new Set(res)].sort();
		}, [data, formatName]);

		// Извлекаем, групируем данные
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
			const currProduction = Number(production_id || 0);
			for (const label of labels) {
				ddata[label] = {
					name: label,
					value: 0,
					color: randomColorLabel(label),
				};
			}
			for (const production of data.production) {
				if (currProduction > 0 && currProduction !== production.production_id) {
					continue;
				}
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
		}, [data, labels, production_id]);

		const isEmpty = useMemo(() => !ddata.length, [ddata]);

		useEffect(() => {
			fetch();
		}, [query]);
		useEffect(() => {
			setQuery((v) => ({ ...v, filterdate, step, event }));
		}, [filterdate, step, event]);

		return (
			<Widget
				{...props}
				loading={isLoading}
				title={
					<>
						Напечатано за{" "}
						<Filterdate
							filterdate={query.filterdate}
							editable={!filterdate?.[0]}
							onChange={(filterdate) => {
								setQuery({
									...query,
									filterdate,
								});
							}}
						/>
					</>
				}
			>
				<Stack h="100%">
					<Group gap="0" justify="flex-end">
						<Checkbox
							onChange={(e) => setFilterGap(e.target.checked)}
							checked={filterGap}
							label="Группировать по G"
						/>
					</Group>
					<AspectRatio ratio={16 / 9}>
						{isEmpty ? (
							<Center w="100%" h="100%" fz="h1" c="dimmed">
								Данные ненашлись!
							</Center>
						) : (
							<TypeBar data={ddata} bars={labels} />
						)}
					</AspectRatio>
				</Stack>
			</Widget>
		);
	},
);

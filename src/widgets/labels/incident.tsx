import { useEffect, useMemo, useState } from "react";
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Filterdate, useStoreIncident } from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { randomColorLabel } from "@/entites/labels";
import { useQueryLoading } from "@/shared/hooks";
import {
	LegendContentPie,
	TooltipContentPie,
	Widget,
	type WidgetProps,
} from "@/shared/ui";
import { AspectRatio, Center, Stack } from "@mantine/core";
import { TbReload } from "react-icons/tb";

export interface WidgetAnalyticsIncidentProps extends WidgetProps {
	filterdate: IRequestAnalyticsIncident["filterdate"];
}

export const WidgetAnalyticsIncident = ({
	filterdate,
	...props
}: WidgetAnalyticsIncidentProps) => {
	return "";
	const storeIncident = useStoreIncident();
	const production_id = useStoreUserProfile((state) => state.production_id);
	const currProduction = Number(production_id || 0);
	const [query, setQuery] = useState<Required<IRequestAnalyticsIncident>>({
		filterdate: filterdate || [null, null],
		data: [],
		fields_name: [],
	});
	const [data, setData] = useState<IAnalyticsIncidentItem[]>([]);

	const isLoading = useQueryLoading(storeIncident);

	const isProduction = query.fields_name.includes("production_id");
	const isPlace = query.fields_name.includes("place_id");

	useEffect(() => {
		setQuery((v) => ({ ...v, filterdate }));
	}, [filterdate]);

	useEffect(() => {
		storeIncident
			.send(query)
			.then(({ data }: IResponseAnalyticsIncident) =>
				setData(
					data.filter(
						(item) =>
							currProduction === 0 || currProduction === item.production_id,
					) as IAnalyticsIncidentItem[],
				),
			);
	}, [query]);

	const ddata = useMemo(() => {
		return (data || {}).map((item) => ({
			name: item.data,
			value: item.total_counter,
			fill: randomColorLabel(item.data),
		}));
	}, [data]);

	const isEmpty = !data.length;

	return (
		<Widget
			loading={isLoading}
			{...props}
			title={
				<>
					Инциденты за{" "}
					<Filterdate
						value={query.filterdate}
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
			menu={[
				{
					children: "Обновить",
					onClick: () => {
						setQuery({
							filterdate,
							data: [],
							fields_name: [],
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
							<PieChart>
								<Tooltip content={TooltipContentPie} />
								<Legend
									layout="vertical"
									verticalAlign="middle"
									align="left"
									content={LegendContentPie}
								/>
								<Pie
									data={ddata}
									dataKey="value"
									nameKey="name"
									cx="50%"
									cy="50%"
								/>
							</PieChart>
						</ResponsiveContainer>
					)}
				</AspectRatio>
			</Stack>
		</Widget>
	);
};

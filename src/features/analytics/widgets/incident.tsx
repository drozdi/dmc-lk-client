import { useEffect, useMemo, useState } from "react";
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { useStoreIncident } from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { randomColorLabel } from "@/entites/labels";
import {
	LegendContentPie,
	TooltipContentPie
} from "@/shared/ui";
import { AspectRatio, Center } from "@mantine/core";

export interface AnalyticIncidentProps {
	filterdate: IRequestAnalyticsIncident["filterdate"];
}

export const AnalyticIncident = ({
	filterdate,
}: AnalyticIncidentProps) => {
	const storeIncident = useStoreIncident();
	const production_id = Number(useStoreUserProfile((state) => state.production_id) || 0);
	const [query, setQuery] = useState<Required<IRequestAnalyticsIncident>>({
		filterdate: filterdate || [null, null],
		data: [],
		fields_name: [],
	});
	const [data, setData] = useState<IAnalyticsIncidentItem[]>([]);

	useEffect(() => {
		setQuery((v) => ({ ...v, filterdate }));
	}, [filterdate]);

	useEffect(() => {
		storeIncident
			.send(query)
			.then(({ data = [] }: IResponseAnalyticsIncident) => {
				setData(
					data.filter(
						(item) =>
							production_id === 0 || production_id === item.production_id,
					) as IAnalyticsIncidentItem[],
				)
			});
	}, [query, production_id]);

	const ddata = useMemo(() => {
		return (data || []).map((item) => ({
			name: item.data,
			value: item.total_counter,
			fill: randomColorLabel(item.data),
		}));
	}, [data]);

	const isEmpty = !data.length;

	return (
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
	);
};

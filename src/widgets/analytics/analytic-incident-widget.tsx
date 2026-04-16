import { useEffect, useState } from "react";
import {
	Pie,
	PieChart,
	ResponsiveContainer,
	Sector,
	Tooltip,
	type PieSectorShapeProps,
} from "recharts";

import { useStoreIncident } from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { randomColorLabel } from "@/entites/labels";
import { useQueryLoading } from "@/shared/hooks";
import { Widget, type WidgetProps } from "@/shared/ui";
import { AspectRatio, Center, Stack } from "@mantine/core";
import { Filterdate } from "./components/filterdate";

interface AnalyticIncidentWidgetProps
	extends WidgetProps, Partial<IRequestAnalyticsIncident> {}

export const AnalyticIncidentWidget = ({
	filterdate,
	...props
}: AnalyticIncidentWidgetProps) => {
	const storeIncident = useStoreIncident();
	const { production_id } = useStoreUserProfile();
	const [query, setQuery] = useState<Required<IRequestAnalyticsIncident>>({
		filterdate: filterdate || [null, null],
		data: [],
		fields_name: [],
	});
	const [data, setData] = useState<IAnalyticsIncidentItem[]>([]);

	const isLoading = useQueryLoading(storeIncident);

	useEffect(() => {
		setQuery((v) => ({ ...v, filterdate }));
	}, [filterdate]);

	useEffect(() => {
		storeIncident
			.send(query)
			.then(({ data }: IResponseAnalyticsIncident) =>
				setData(data as IAnalyticsIncidentItem[]),
			);
	}, [query]);

	const isEmpty = !data.length;

	return (
		<Widget
			{...props}
			title={
				<>
					Инциденты за{" "}
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
			loading={isLoading}
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
								<Tooltip />
								<Pie
									data={data}
									cx="50%"
									cy="50%"
									fill="#8884d8"
									shape={(props: PieSectorShapeProps) => {
										return (
											<Sector
												{...props}
												fill={randomColorLabel(props.payload.data)}
											/>
										);
									}}
									nameKey="data"
									dataKey="total_counter"
								/>
							</PieChart>
						</ResponsiveContainer>
					)}
				</AspectRatio>
			</Stack>
		</Widget>
	);
};

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
import { useQueryLoading } from "@/shared/hooks";
import { Widget } from "@/shared/ui";
import { cached, randomColor } from "@/shared/utils";
import { AspectRatio, Stack } from "@mantine/core";
import { Filterdate } from "./components/filterdate";

const colors = cached<string>((name: string) => randomColor());

export const AnalyticIncidentWidget = (
	props: Partial<IRequestAnalyticsIncident>,
) => {
	const storeIncident = useStoreIncident();
	const { production_id } = useStoreUserProfile();
	const [query, setQuery] = useState<Required<IRequestAnalyticsIncident>>({
		filterdate: props.filterdate || [null, null],
		data: [],
		fields_name: [],
	});
	const [data, setData] = useState<IAnalyticsIncidentItem[]>([]);

	const isLoading = useQueryLoading(storeIncident);

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
			dragable
			title={
				<>
					Инциденты за{" "}
					<Filterdate
						filterdate={query.filterdate}
						editable={!props.filterdate?.[0]}
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
						<span>Данные ненашлись!</span>
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
											<Sector {...props} fill={colors(props.payload.data)} />
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

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
import { TbReload } from "react-icons/tb";
import { Filterdate } from "./components/filterdate";

interface AnalyticIncidentWidgetProps
	extends WidgetProps, Partial<IRequestAnalyticsIncident> {}

export interface WidgetAnalyticIncidentProps extends WidgetProps {}

export const WidgetAnalyticIncident = ({
	filterdate,
	...props
}: AnalyticIncidentWidgetProps) => {
	const storeIncident = useStoreIncident();
	const { production_id } = useStoreUserProfile();
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

	const handleClick = (...args) => {
		const { activeIndex } = args[0];

		if (isProduction && isPlace) {
		} else if (isProduction) {
			setQuery((v) => ({
				...v,
				fields_name: [
					"production_id",
					"place_id",
					"address_production",
					"device_name",
				],
			}));
		} else {
			setQuery((v) => ({
				...v,
				fields_name: ["production_id", "address_production"],
			}));
		}
	};

	const isEmpty = !data.length;

	return (
		<Widget
			loading={isLoading}
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
							<PieChart onClick={handleClick}>
								<Tooltip content={(arg) => {
									console.log (arg)
									const {activeIndex} = arg
									const item = data[activeIndex]
									console.log(item)
								}} />
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

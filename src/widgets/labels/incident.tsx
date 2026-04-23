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
import { Text, Widget, type WidgetProps } from "@/shared/ui";
import { AspectRatio, Center, Stack } from "@mantine/core";
import { TbReload } from "react-icons/tb";
import { Filterdate } from "../analytics/ui/filterdate";

export interface WidgetAnalyticsIncidentProps extends WidgetProps {
	filterdate: IRequestAnalyticsIncident["filterdate"];
}

export const WidgetAnalyticsIncident = ({
	filterdate,
	...props
}: WidgetAnalyticsIncidentProps) => {
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
								<Tooltip
									content={(arg) => {
										const { activeIndex } = arg;
										const item = data[activeIndex];
										return (
											<Text
												maw={200}
												bg="var(--mantine-color-body)"
												bd="1px solid var(--mantine-color-default-border)"
												p="xs"
											>
												{item?.data} - {item?.total_counter}
											</Text>
										);
									}}
								/>
								{/* <Legend
									verticalAlign="bottom"
									content={(arg) => {
										console.log(arg);
										const { payload } = arg;
										return (
											<Box>
												{payload?.map((item, index) => (
													<Text
														key={item.value}
														style={{
															color: item.color,
														}}
													>
														{item.value} - {item.payload.total_counter}
													</Text>
												))}
											</Box>
										);
									}}
								/> */}
								<Pie
									data={data}
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

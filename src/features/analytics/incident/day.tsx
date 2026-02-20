import { useQueryAnalyticsFields } from "@/entites/analytics";
import { useStoreIncident } from "@/entites/analytics/stores/use-store-incident";
import { Loading } from "@/shared/ui";
import { Table } from "@mantine/core";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export const IncidentDay = ({
	day,
	showFields = ["place_name", "device_name", "event_name", "node_name"],
}: {
	day: string;
	showFields?: string[];
}) => {
	const storeIncident = useStoreIncident();
	const { data: fields } = useQueryAnalyticsFields();
	const [data, setData] = useState<IResponseAnalyticsIncident>([]);
	const [query, setQuery] = useState<IRequestAnalyticsIncident>({
		limit_page: 100,
		filterdate: [],
		data: [],
		fields_name: [
			"timestamp",
			"inn_company",
			"production_id",
			"taskid",
			"place_id",
			"place_name",
			"place_type",
			"device_id",
			"device_name",
			"device_type",
			"event_id",
			"event_name",
			"node_id",
			"node_name",
			"node_level",
			"data",
			"exported",
			"created",
			"company_id",
			"name_production",
			"address_production",
			"id_company",
			"kpp_company",
			"name_company",
			"address_company",
			"descriptions_company",
			"phone_company",
		],
		details_field: [
			"id",
			"production_id",
			"taskid",
			"device_id",
			"event_id",
			"node_id",
			"place_id",
		],
	});

	useEffect(() => {
		const currDay = dayjs(day);
		setQuery(
			(v: IRequestAnalyticsIncident): IRequestAnalyticsIncident => ({
				...v,
				filterdate: [
					currDay.format("YYYY-MM-DD"),
					currDay.day(currDay.day() + 1).format("YYYY-MM-DD"),
				],
			}),
		);
	}, [day]);

	useEffect(() => {
		query.filterdate?.length &&
			storeIncident
				.send(query)
				.then((data) => setData(data as IResponseAnalyticsIncident));
	}, [query]);

	return (
		<Loading active={storeIncident.isLoading} keepMounted>
			<Table>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Дата</Table.Th>
						{showFields.map((name) => (
							<Table.Th key={name}>
								{fields?.[name]?.label || name}
							</Table.Th>
						))}
						<Table.Th w="35%">Ошибка</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{data?.length ? (
						data.map((item: IAnalyticsIncidentItem) => (
							<Table.Tr key={item.id}>
								<Table.Td>
									{dayjs(item.timestamp).format(
										"YYYY-MM-DD HH:mm",
									)}
								</Table.Td>
								{showFields.map((name) => (
									<Table.Td key={name}>{item[name]}</Table.Td>
								))}
								<Table.Td>
									{item.data} ({item.total_counter})
								</Table.Td>
							</Table.Tr>
						))
					) : (
						<Table.Tr>
							<Table.Td colSpan={6} ta="center" fz="h2" p="md">
								Данные отсутствуют
							</Table.Td>
						</Table.Tr>
					)}
				</Table.Tbody>
			</Table>
		</Loading>
	);
};

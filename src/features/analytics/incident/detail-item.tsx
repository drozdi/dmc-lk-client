import { useEnumsFields, useQueryIncident } from "@/entites/analytics";
import { useQueryLoading } from "@/shared/hooks";
import { Loading } from "@/shared/ui";
import { TableSkeleton } from "@/shared/ui/skeleton";
import { Button, Group, Table } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { TbX } from "react-icons/tb";

export function IncidentDetailItem(props: IRequestAnalyticsIncident) {
	const ef = useEnumsFields();
	const [query, setQuery] = useState<IRequestAnalyticsIncident>({
		...props,
		fields_name: ef.filter([
			...(props.fields_name || []),
			"name_production",
			"address_production",
			"event_name",
			"device_name",
			"device_type",
			"node_name",
			"place_name",
			"production_id",
			"device_id",
			"node_id",
			"place_id",
		]),
	});
	const qi = useQueryIncident(query);
	const { data } = qi;
	const isLoading = useQueryLoading(qi, ef);

	useEffect(() => {
		setQuery((v) => ({
			...v, 
			...props, 
			fields_name: ef.filter([
				...(props.fields_name || []),
				"name_production",
				"address_production",
				"event_name",
				"device_name",
				"device_type",
				"node_name",
				"place_name",
				"production_id",
				"device_id",
				"node_id",
				"place_id",
			]),
		}));
	}, [props.filterdate, props.data, props.fields_name, ef]);

	const [{ name_production, production_id }, setProduction] = useState<{
		name_production: IProduction["production_name"];
		production_id: IProduction["production_id"];
	}>({
		name_production: "",
		production_id: 0,
	});

	const ddata = useMemo(() => {
		const res: Record<string, any> = {};

		if (production_id) {
			data?.forEach((item: IAnalyticsIncidentItem) => {
				if (item.production_id == production_id) {
					res[item.device_id] = {
						...item,
						total_counter:
							(res[item.device_id]?.total_counter || 0) + item.total_counter,
					};
				}
			});
			return Object.values(res).sort(
				(a, b) => b.total_counter - a.total_counter,
			);
		} else {
			data?.forEach((item: IAnalyticsIncidentItem) => {
				res[item.production_id] = {
					...item,
					total_counter:
						(res[item.production_id]?.total_counter || 0) + item.total_counter,
				};
			});
			return Object.values(res).sort(
				(a, b) => b.total_counter - a.total_counter,
			);
		}
	}, [data, production_id]);

	const handleProduction = (
		production_id: IProduction["production_id"],
		name_production: IProduction["production_name"],
	) => {
		setProduction({
			name_production,
			production_id,
		});
	};

	return (
		<Loading
			keepMounted
			active={isLoading}
			skeleton={<TableSkeleton rows={4} mih={120} />}
		>
			<Group justify="center" mb='md'>
				{production_id && (
					<Button
						color="red"
						variant="outline"
						onClick={() => handleProduction(0, "")}
						rightSection={<TbX />}
					>
						Площадка: {name_production}
					</Button>
				)}
			</Group>
			<Table highlightOnHover={!production_id}>
				<Table.Tbody>
					{production_id ? (
						<>
							<Table.Tr>
								<Table.Th colSpan={2} ta="center">
									Устройства
								</Table.Th>
							</Table.Tr>

							{ddata.map((item: IAnalyticsIncidentItem) => (
								<Table.Tr key={item.device_id}>
									<Table.Td>{item.device_name}</Table.Td>
									<Table.Td>{item.total_counter}</Table.Td>
								</Table.Tr>
							))}
						</>
					) : (
						<>
							<Table.Tr>
								<Table.Th colSpan={3} ta="center">
									Площадки
								</Table.Th>
							</Table.Tr>
							{ddata.map((item: IAnalyticsIncidentItem) => (
								<Table.Tr
									className="cursor-pointer"
									key={item.production_id}
									onClick={() =>
										handleProduction(item.production_id, item.name_production)
									}
								>
									<Table.Td>{item.name_production}</Table.Td>
									<Table.Td>{item.address_production}</Table.Td>
									<Table.Td>{item.total_counter}</Table.Td>
								</Table.Tr>
							))}
						</>
					)}
				</Table.Tbody>
			</Table>
		</Loading>
	);
}

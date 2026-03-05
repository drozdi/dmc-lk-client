import { useEnumsFields } from "@/entites/analytics";
import { DataTable } from "@/shared/ui";
import { Table } from "@mantine/core";

interface ListShortProps {
	className?: string;
	fields?: string[];
	data?: IAnalyticsIncidentItem[];
}

export const ListShort = ({
	className,
	fields = [],
	data = [],
}: ListShortProps) => {
	const ef = useEnumsFields();
	const computedFields = ef.filter(fields);

	return (
		<DataTable<IAnalyticsIncidentItem>
			className={className}
			idAccessor={(row) => Object.values(row).join("")}
			columns={[
				...computedFields.map((field) => ({
					accessor: field,
					title: ef.findLabelByCode(field),
					sortKey: field,
					sortable: true,
					// noWrap: true,
				})),
				{
					accessor: "data",
					title: "Ошибка",
					sortKey: "data",
					sortable: true,
					// noWrap: true,
				},
				{
					accessor: "total_counter",
					title: "Всего",
					sortable: true,
					sortKey: "total_counter",
				},
			]}
			highlightOnHover={true}
			striped={true}
			verticalAlign="top"
			scrollAreaProps={{ type: "never" }}
			records={data}
			fetching={ef.isLoading}
		/>
	);
	return (
		<Table>
			<Table.Thead>
				<Table.Tr>
					{computedFields.map((name) => (
						<Table.Th key={name}>{qaf.findLabelByCode(name)}</Table.Th>
					))}
					<Table.Th>Ошибка</Table.Th>
					<Table.Th>Всего</Table.Th>
				</Table.Tr>
			</Table.Thead>
			<Table.Tbody>
				{data?.length ? (
					data.map((item: IAnalyticsIncidentItem) => (
						<Table.Tr key={item.id}>
							{computedFields.map((name) => (
								<Table.Td key={name}>{item[name]}</Table.Td>
							))}
							<Table.Td>{item.data}</Table.Td>
							<Table.Td>{item.total_counter}</Table.Td>
						</Table.Tr>
					))
				) : (
					<Table.Tr>
						<Table.Td
							colSpan={computedFields.length + 2}
							ta="center"
							fz="h2"
							p="md"
						>
							Данные отсутствуют
						</Table.Td>
					</Table.Tr>
				)}
			</Table.Tbody>
		</Table>
	);
};

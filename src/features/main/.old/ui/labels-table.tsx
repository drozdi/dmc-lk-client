import { NumberFormatter, Table, TableTr } from "@mantine/core";

export interface LabelsTableProps {
	data: Array<{
		date: string;
		total: number;
		[key: string]: string | number;
	}>;
	headers: string[];
}

export const LabelsTable = ({ data = [], headers = [] }: LabelsTableProps) => {
	return (
		<Table mb="md">
			<Table.Thead>
				<TableTr>
					<Table.Th>Дата</Table.Th>
					{headers.map((label) => (
						<Table.Th key={label}>{label}</Table.Th>
					))}
					<Table.Th>Количество</Table.Th>
				</TableTr>
			</Table.Thead>
			<Table.Tbody>
				{data.map((tr) => (
					<Table.Tr key={tr.date}>
						<Table.Td>{tr.date}</Table.Td>
						{headers.map((label) => (
							<Table.Td key={label}>
								<NumberFormatter value={tr[label]} />
							</Table.Td>
						))}
						<Table.Td>
							<NumberFormatter value={tr.total} />
						</Table.Td>
					</Table.Tr>
				))}
			</Table.Tbody>
		</Table>
	);
};

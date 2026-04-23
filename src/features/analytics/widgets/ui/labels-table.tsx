import { NumberFormatter, Table, TableTr } from "@mantine/core";
import { type LabelsProps } from "./type";

export interface LabelsTableProps extends LabelsProps {}

export const LabelsTable = ({ data = [], bars = [] }: LabelsTableProps) => {
	return (
		<Table mb="md">
			<Table.Thead>
				<TableTr>
					<Table.Th>Дата</Table.Th>
					{bars.map((label) => (
						<Table.Th key={label}>{label}</Table.Th>
					))}
					<Table.Th>Количество</Table.Th>
				</TableTr>
			</Table.Thead>
			<Table.Tbody>
				{data.map((tr) => (
					<Table.Tr key={tr.date}>
						<Table.Td>{tr.date}</Table.Td>
						{bars.map((label) => (
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

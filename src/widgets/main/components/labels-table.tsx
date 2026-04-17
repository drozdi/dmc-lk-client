import { $setting } from "@/shared";
import { NumberFormatter, Table, TableTr } from "@mantine/core";
import dayjs from "dayjs";

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
		<Table>
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
						<Table.Td>
							{dayjs(tr.date).format($setting.get("formatDate"))}
						</Table.Td>
						{headers.map((label) => (
							<Table.Td key={label}>
								<NumberFormatter value={tr[label]} thousandSeparator=" " />
							</Table.Td>
						))}
						<Table.Td>
							<NumberFormatter value={tr.total} thousandSeparator=" " />
						</Table.Td>
					</Table.Tr>
				))}
			</Table.Tbody>
		</Table>
	);
};

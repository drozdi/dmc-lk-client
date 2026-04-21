import { useEnumsEvents } from "@/entites/analytics";
import { $setting } from "@/shared";
import { NumberFormatter, Table } from "@mantine/core";
import dayjs from "dayjs";

const ee = useEnumsEvents();

export interface EventTableProps {
	data: (Record<AnalyticEvent, number> & {
		date: string;
	})[];
	lines?: AnalyticEvent[];
}

export const EventTable = ({ data = [], lines = ["p"] }: EventTableProps) => {
	return (
		<Table>
			<Table.Thead>
				<Table.Tr>
					<Table.Th>Дата</Table.Th>
					{lines.map((line) => (
						<Table.Th key={line}>{ee.findLabelByCode(line)}</Table.Th>
					))}
				</Table.Tr>
			</Table.Thead>
			<Table.Tbody>
				{data.map((tr) => (
					<Table.Tr key={tr.date}>
						<Table.Td>
							{dayjs(tr.date).format($setting.get("formatDate"))}
						</Table.Td>
						{lines.map((line) => (
							<Table.Td key={line}>
								<NumberFormatter value={tr[line]} />
							</Table.Td>
						))}
					</Table.Tr>
				))}
			</Table.Tbody>
		</Table>
	);
};

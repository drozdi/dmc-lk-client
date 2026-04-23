import { useEnumsEvents } from "@/entites/analytics";
import { $setting } from "@/shared";
import { NumberFormatter, Table } from "@mantine/core";
import dayjs from "dayjs";
import type { EventsProps } from "./type";

export interface EventTableProps extends EventsProps {}

const ee = useEnumsEvents();

export const EventsTable = ({
	query,
	data = [],
	events = ["p"],
	onClick,
}: EventTableProps) => {
	return (
		<Table>
			<Table.Thead>
				<Table.Tr>
					<Table.Th>Дата</Table.Th>
					{events.map((event) => (
						<Table.Th key={event}>{ee.findLabelByCode(event)}</Table.Th>
					))}
					<Table.Th>Всего</Table.Th>
				</Table.Tr>
			</Table.Thead>
			<Table.Tbody>
				{data.map((tr) => (
					<Table.Tr key={tr.date}>
						<Table.Td
							onClick={() => {
								onClick?.({ activeLabel: tr.date });
							}}
						>
							{["s", "m", "h"].includes(query.step)
								? tr.date
								: dayjs(tr.date).format($setting.get("formatDate"))}
						</Table.Td>
						{events.map((event) => (
							<Table.Td key={event}>
								<NumberFormatter value={tr[event]} />
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

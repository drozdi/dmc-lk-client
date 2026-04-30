import { useEnumsEvents } from "@/entites/analytics";
import { $setting } from "@/shared";
import { NumberFormatter, Table } from "@mantine/core";
import dayjs from "dayjs";
import { Fragment } from 'react';
import type { EventsProps } from "./type";

export interface EventTableProps extends EventsProps {
	percent?: AnalyticEvent[];
}

const ee = useEnumsEvents();

export const EventsTable = ({
	query,
	data = [],
	events = ["p"],
	percent = ["d"],
	onClick,
}: EventTableProps) => {
	return (
		<Table>
			<Table.Thead>
				<Table.Tr>
					<Table.Th>Дата</Table.Th>
					{events.map((event) => (
						<Fragment key={event} >
							<Table.Th>{ee.findLabelByCode(event)}</Table.Th>
							{percent.includes(event)? <Table.Th>{ee.findLabelByCode(event)} (%)</Table.Th>: null}	
						</Fragment>
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
							<Fragment key={event} >
								<Table.Td>
									<NumberFormatter value={tr[event]} />
								</Table.Td>
								{percent.includes(event)? <Table.Td>{Math.round(tr[event] / (tr.total || 1)*100)} %</Table.Td>: null}	
							</Fragment>
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

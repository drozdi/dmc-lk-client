import { Table } from "@mantine/core";
import type { TableBodyRowProps } from '../type';
import { TableBodyCell } from "./cell";
import { TableBodyGroup } from "./group";
import { TableBodyGrouped } from "./grouped";

export function TableBodyRow<T = object>({ node, columns, level = 0, group, grouped }: TableBodyRowProps<T>) {
	return <>
		<Table.Tr>
			{columns.map((column) => {
				return <TableBodyCell key={column.field as string} node={node} column={column} level={level} />
			})}
		</Table.Tr>
		{grouped && <TableBodyGrouped node={node} columns={columns} column={grouped} level={level + 1} />}
		{group && <TableBodyGroup node={node} columns={columns} column={group} level={level + 1} />}
	</>
}
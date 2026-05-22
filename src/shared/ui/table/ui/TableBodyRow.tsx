import { Table } from "@mantine/core";
import { type ColumnEntity } from "../DataColumn";
import { type TableNode } from "../TableData";
import { TableBodyCell } from "./TableBodyCell";
import { TableBodyGroup } from "./TableBodyGroup";
import { TableBodyGrouped } from "./TableBodyGrouped";

export interface TableBodyRowProps<T = object> {
	node: TableNode<T>;
	columns: ColumnEntity<T>[];
	level?: number;
}

export function TableBodyRow<T = object>({ node, columns, level = 0 }: TableBodyRowProps<T>) {
	const group = columns.find(c => c.isGroup);
	const grouped = columns.find(c => c.isGrouped);
	
	return <>
		<Table.Tr>
			{columns.map((column) => {
				return <TableBodyCell key={column.field as string} node={node} column={column} level={level} />
			})}
		</Table.Tr>
		{group && <TableBodyGroup node={node} columns={columns} column={group} level={level + 1} />}
		{grouped && <TableBodyGrouped node={node} columns={columns} column={grouped} level={level + 1} />}
	</>
}
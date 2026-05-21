import { Table } from "@mantine/core";
import { useTableDataContext } from '../context';
import { type ColumnEntity } from "../DataColumn";
import { type TableNode } from "../TableData";
import { TableBodyCell } from "./TableBodyCell";
import { TableBodyGroup } from "./TableBodyGroup";

export interface TableBodyRowProps<T = object> {
	node: TableNode<T>;
	columns: ColumnEntity<T>[];
}

export function TableBodyRow<T = object>({node, columns}: TableBodyRowProps<T>) {
	const ctx = useTableDataContext();
	let group: ColumnEntity<T> | undefined = undefined
	return <>
		<Table.Tr>
			{columns.map((column) => {
				if (column.isGroup) {
					group = column
				}
				return <TableBodyCell key={column.field as string} node={node} column={column} />
			})}
		</Table.Tr>
		{group && <TableBodyGroup node={node} columns={columns} column={group} />}
	</>
}
import { Table } from "@mantine/core";
import { useTableDataContext } from '../context';
import { type ColumnEntity } from "../DataColumn";
import { type TableNode } from "../TableData";
import { TableBodyCell } from "./TableBodyCell";

export interface TableBodyRowProps<T = object> {
	item: TableNode<T>;
	columns: ColumnEntity<T>[];
}

export function TableBodyRow<T = object>({item, columns}: TableBodyRowProps<T>) {
	const ctx = useTableDataContext();
	return <Table.Tr>
		{columns.map((column) => {
			return <TableBodyCell key={column.field as string} item={item} column={column} />
		})}
	</Table.Tr>
}
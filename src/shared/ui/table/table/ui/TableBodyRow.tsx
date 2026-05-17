import { Table } from "@mantine/core";
import { type ColumnEntity } from "../XColumn";
import { TableBodyCell } from "./TableBodyCell";

export interface TableBodyProps<T = object> {
	item: T;
	columns: ColumnEntity<T>[];
}

export function TableBodyRow<T = object>({item, columns}: TableBodyProps<T>) {
	return <Table.Tr>
		{columns.map((column) => {
			return <TableBodyCell key={column.field as string} item={item} column={column} />
		})}
	</Table.Tr>
}
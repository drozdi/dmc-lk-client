import { Table } from "@mantine/core";
import { type ColumnEntity } from "../XColumn";

export interface TableBodyCellProps<T> {
	item: T;
	column: ColumnEntity<T>;
}

export function TableBodyCell<T = object>({ item, column }: TableBodyCellProps<T>) {
	return <Table.Td>
		{column.body?.(item, column) || item?.[column.field] || ''}
	</Table.Td>
}
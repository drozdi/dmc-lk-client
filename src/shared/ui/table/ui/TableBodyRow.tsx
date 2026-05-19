import { Table } from "@mantine/core";
import { type ColumnEntity } from "../DataColumn";
import { type TableNode } from "../TableData";
import { TableBodyCell } from "./TableBodyCell";

export interface TableBodyRowProps<T = object> {
	item: TableNode<T>;
	columns: ColumnEntity<T>[];
}

export function TableBodyRow<T = object>({item, columns}: TableBodyRowProps<T>) {
	return <Table.Tr>
		{columns.map((column) => {
			return <TableBodyCell key={column.field as string} item={item.data} column={column} />
		})}
	</Table.Tr>
}
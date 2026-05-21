import { useTableDataContext } from '../context';
import { type ColumnEntity } from "../DataColumn";
import { type TableNode } from "../TableData";
import { convertNodes } from '../utils';
import { TableBody } from "./TableBody";
export interface TableBodyGroupProps<T = object> {
	node: TableNode<T>;
	columns: ColumnEntity<T>[];
	column: ColumnEntity<T>;
}


export function TableBodyGroup<T = object>({ node, columns, column }: TableBodyGroupProps<T>) {
	if (!(node.data?.[column.field] as T[])?.length) {
		return null;
	}
	const { expands } = useTableDataContext();
	const isExpand = expands.includes(node.index);
	if (!isExpand) {
		return null;
	}
	return <TableBody<T> nodes={convertNodes<T>(node.data[column.field] as T[])} columns={columns} />
}
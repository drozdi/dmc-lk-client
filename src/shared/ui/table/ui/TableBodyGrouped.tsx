import { useTableDataContext } from '../context';
import { type ColumnEntity } from "../DataColumn";
import { type TableNode } from "../TableData";
import { TableBody } from "./TableBody";
export interface TableBodyGroupedProps<T = object> {
	node: TableNode<T>;
	columns: ColumnEntity<T>[];
	column: ColumnEntity<T>;
	level?: number;
}


export function TableBodyGrouped<T = object>({ node, columns, column, level = 0 }: TableBodyGroupedProps<T>) {
	if (!(node.data?.[column.field] as T[])?.length) {
		return null;
	}
	const { expands } = useTableDataContext();
	const isExpand = expands.includes(node.index);
	if (!isExpand) {
		return null;
	}
	return <TableBody<T> nodes={node.nodes || []} columns={columns} level={level} />
}
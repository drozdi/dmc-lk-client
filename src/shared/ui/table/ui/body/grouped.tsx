import { TableBody } from ".";
import { useTableDataContext } from '../../context';
import type { TableBodyGroupedProps } from '../type';

export function TableBodyGrouped<T = object>({ node, columns, column, level = 0 }: TableBodyGroupedProps<T>) {
	// if (!(node.data?.[column.field as keyof T] as T[])?.length) {
	// 	return null;
	// }
	const { expands } = useTableDataContext<T>();
	const isExpand = expands.includes(node.index);
	if (!isExpand) {
		return null;
	}
	return <TableBody<T> nodes={node.nodes || []} columns={columns} level={level} />
}
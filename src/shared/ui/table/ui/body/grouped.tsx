import { useMemo } from 'react';
import { useTableDataContext } from '../../context';
import type { TableBodyGroupedProps } from '../type';
import { TableBodyRow } from './row';

export function TableBodyGrouped<T = object>({ node, columns, level = 0 }: TableBodyGroupedProps<T>) {
	const { isExpanded } = useTableDataContext<T>();
	const group = useMemo(() => columns.find((col) => col.isGroup), [columns]);
	const grouped = useMemo(() => columns.find((col) => col.isGrouped), [columns]);

	if (!isExpanded(node.index, 'grouped')) {
		return null;
	}

	return (
		<>
			{(node.nodes || []).map((child) => (
				<TableBodyRow<T>
					key={child.index}
					node={child}
					columns={columns}
					level={level}
					group={group}
					grouped={grouped}
				/>
			))}
		</>
	);
}

import { memo, useMemo } from 'react';
import { useTableGroupingContext } from '../../context';
import { getGroupedColumnForLevel } from '../../utils/group-by';
import type { TableBodyProps } from '../type';
import { TableBodyRow } from './row';

export * from './cell';
export * from './cell-expander';
export * from './cell-slot';
export * from './cell-wrap';
export * from './expand';
export * from './expander';
export * from './group';
export * from './grouped';
export * from './row';

export const TableBody = memo(function TableBody<T = object>({
	nodes,
	columns,
	level,
}: TableBodyProps<T>) {
	const { groupKeys } = useTableGroupingContext<T>();
	const group = useMemo(() => columns.find((col) => col.isGroup), [columns]);
	const grouped = useMemo(
		() => getGroupedColumnForLevel(columns, groupKeys, 0),
		[columns, groupKeys],
	);

	return (
		<>
			{nodes.map((node) => {
				return (
					<TableBodyRow<T>
						node={node}
						columns={columns}
						key={node.expandKey ?? node.index}
						level={level}
						group={group}
						grouped={grouped}
					/>
				);
			})}
		</>
	);
}) as <T = object>(props: TableBodyProps<T>) => React.ReactNode;

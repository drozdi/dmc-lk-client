import { useMemo } from 'react';
import type { ColumnEntity } from '../../type';
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

export function TableBody<T = object>({ nodes, columns, level }: TableBodyProps<T>) {
	const group = useMemo<ColumnEntity<T> | undefined>(() => {
		return columns.find((v) => v.isGroup);
	}, [columns]);
	const grouped = useMemo<ColumnEntity<T> | undefined>(() => {
		return columns.find((v) => v.isGrouped);
	}, [columns]);

	// const fields = useMemo<ColumnEntity<T>[]>(() => {
	// 	let ret: ColumnEntity<T>[] = [];
	// 	(function recursive(columns: ColumnEntity<T>[]) {
	// 		for (const column of columns) {
	// 			if (column.isEmpty && column.isColumns) {
	// 				recursive(column.columns);
	// 			} else {
	// 				ret.push(column);
	// 			}
	// 		}
	// 	})(columns);

	// 	return ret.filter(
	// 		(v) =>
	// 			v.field &&
	// 			(grouped?.isGrouped || v.field != grouped?.field)
	// 	);
	// }, [columns, grouped]);

	return (
		<>
			{nodes.map((node) => {
				return (
					<TableBodyRow<T>
						node={node}
						columns={columns}
						key={node.index}
						level={level}
						group={group}
						grouped={grouped}
					/>
				);
			})}
		</>
	);
}

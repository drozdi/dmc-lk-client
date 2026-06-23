import { useCallback, useState } from 'react';
import type { ColumnEntity, TableStorage } from '../type';

export function useColumnOrder<T = object>(
	columns: ColumnEntity<T>[],
	storage?: TableStorage,
	initialColumnOrder?: (keyof T)[],
	onInitialColumnOrder?: (columnOrder: (keyof T)[]) => void,
) {
	const [internalColumnOrder, setInternalColumnOrder] = useState<(keyof T)[]>(() => {
		const columnOrder = (storage?.getItem('columns.sorted') ||
			columns.map((v) => v.field)) as (keyof T)[];
		return columnOrder;
	});

	const columnOrder = initialColumnOrder ?? internalColumnOrder;
	const setColumnOrder = useCallback(
		(newOrder: (keyof T)[]) => {
			if (initialColumnOrder) {
				onInitialColumnOrder?.(newOrder);
			} else {
				setInternalColumnOrder(newOrder);
				storage?.setItem('columns.sorted', newOrder);
			}
		},
		[onInitialColumnOrder, storage],
	);

	const sortColumn = useCallback(
		(dragIndex: number, dropIndex: number) => {
			const newOrder = [...columnOrder];
			const [dragged] = newOrder.splice(dragIndex, 1);
			newOrder.splice(dropIndex, 0, dragged);
			setColumnOrder(newOrder);
		},
		[columnOrder, setColumnOrder],
	);

	return {
		columnOrder,
		setColumnOrder,
		sortColumn,
		setInternalColumnOrder,
	};
}
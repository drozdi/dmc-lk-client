import { useCallback, useEffect, useRef, useState } from 'react';
import type { ColumnEntity, TableStorage } from '../type';
import { getColumnFields, mergeColumnOrder } from '../utils/column-fields';

export function useColumnOrder<T = object>(
	columns: ColumnEntity<T>[],
	storage?: TableStorage,
	initialColumnOrder?: (keyof T)[],
	onInitialColumnOrder?: (columnOrder: (keyof T)[]) => void,
) {
	const fields = getColumnFields(columns);
	const fieldsKey = fields.join('|');
	const prevFieldsKeyRef = useRef(fieldsKey);

	const [internalColumnOrder, setInternalColumnOrder] = useState<(keyof T)[]>(() => {
		const stored = (storage?.getItem('columns.sorted') || []) as (keyof T)[];
		const fallback = getColumnFields(columns);
		return mergeColumnOrder(stored.length ? stored : fallback, fallback);
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
		[initialColumnOrder, onInitialColumnOrder, storage],
	);

	useEffect(() => {
		if (prevFieldsKeyRef.current === fieldsKey) {
			return;
		}
		prevFieldsKeyRef.current = fieldsKey;

		if (initialColumnOrder) {
			const synced = mergeColumnOrder(initialColumnOrder, fields);
			if (synced.length !== initialColumnOrder.length) {
				onInitialColumnOrder?.(synced);
			}
			return;
		}

		setInternalColumnOrder((prev) => {
			const synced = mergeColumnOrder(prev, fields);
			storage?.setItem('columns.sorted', synced);
			return synced;
		});
	}, [fieldsKey, fields, initialColumnOrder, onInitialColumnOrder, storage]);

	const sortColumn = useCallback(
		(dragIndex: number, dropIndex: number) => {
			const orderFields = columnOrder.filter((field) => fields.includes(field));
			const newOrder = [...orderFields];
			const [dragged] = newOrder.splice(dragIndex, 1);
			if (dragged === undefined) {
				return;
			}
			newOrder.splice(dropIndex, 0, dragged);
			setColumnOrder(newOrder);
		},
		[columnOrder, fields, setColumnOrder],
	);

	return {
		columnOrder,
		setColumnOrder,
		sortColumn,
		setInternalColumnOrder,
	};
}

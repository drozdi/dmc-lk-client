import { useCallback, useEffect, useRef, useState } from 'react';
import { getColumnFields, intersectFields } from '../utils/column-fields';
import type { ColumnEntity, TableStorage } from '../type';

export function useColumnHidden<T = object>(
	columns: ColumnEntity<T>[],
	storage?: TableStorage,
	initialHiddenColumns?: (keyof T)[],
	onInitialHiddenColumns?: (column: ColumnEntity<T>, hidden?: boolean) => void,
) {
	const fields = getColumnFields(columns);
	const fieldsKey = fields.join('|');
	const prevFieldsKeyRef = useRef(fieldsKey);

	const [internalHiddenColumns, setInternalHiddenColumns] = useState<(keyof T)[]>(() => {
		const stored = (storage?.getItem('columns.hidden') || initialHiddenColumns || []) as (keyof T)[];
		return intersectFields(stored, fields);
	});

	const hiddenColumns = initialHiddenColumns ?? internalHiddenColumns;

	useEffect(() => {
		if (prevFieldsKeyRef.current === fieldsKey) {
			return;
		}
		prevFieldsKeyRef.current = fieldsKey;

		if (initialHiddenColumns) {
			return;
		}

		setInternalHiddenColumns((prev) => {
			const synced = intersectFields(prev, fields);
			storage?.setItem('columns.hidden', synced);
			return synced;
		});
	}, [fieldsKey, fields, initialHiddenColumns, storage]);

	const toggleColumn = useCallback(
		(column: ColumnEntity<T>, hidden?: boolean) => {
			if (!column.isToggleable) {
				return;
			}

			setInternalHiddenColumns((prev) => {
				const field = column.field as keyof T;
				let newHidden: (keyof T)[];
				if (hidden !== undefined) {
					newHidden = hidden
						? [...prev, field].filter((f, i, arr) => arr.indexOf(f) === i)
						: prev.filter((f) => f !== field);
				} else {
					newHidden = prev.includes(field)
						? prev.filter((f) => f !== field)
						: [...prev, field];
				}

				if (storage && !initialHiddenColumns) {
					storage.setItem('columns.hidden', newHidden);
				}
				onInitialHiddenColumns?.(column, hidden);
				return newHidden;
			});
		},
		[storage, initialHiddenColumns, onInitialHiddenColumns],
	);

	return {
		hiddenColumns,
		toggleColumn,
		setInternalHiddenColumns,
	};
}

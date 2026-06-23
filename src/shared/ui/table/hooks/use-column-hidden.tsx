import { useCallback, useState } from 'react';
import type { ColumnEntity, TableStorage } from '../type';

export function useColumnHidden<T = object>(
	columns: ColumnEntity<T>[],
	storage?: TableStorage,
	initialHiddenColumns?: (keyof T)[],
	onInitialHiddenColumns?: (column: ColumnEntity<T>, hidden?: boolean) => void,
) {
	const [internalHiddenColumns, setInternalHiddenColumns] = useState<(keyof T)[]>(() => {
		return (storage?.getItem('columns.hidden') ||
			initialHiddenColumns ||
			[]) as (keyof T)[];
	});

	const hiddenColumns = initialHiddenColumns ?? internalHiddenColumns;
	const toggleColumn = useCallback(
		(column: ColumnEntity<T>, hidden?: boolean) => {
			if (!column.isToggleable) {
				return;
			}

			setInternalHiddenColumns((prev) => {
				const field = column.field as keyof T;
				const hiddening = hidden ?? prev.includes(field);
				let newHidden;
				if (hiddening) {
					newHidden = prev.filter((f) => f !== field);
				} else {
					newHidden = [...prev, field];
				}
				if (storage && !onInitialHiddenColumns) {
					storage.setItem('columns.hidden', newHidden);
				}
				onInitialHiddenColumns?.(column, hidden);
				return newHidden as (keyof T)[];
			});
		},
		[storage, onInitialHiddenColumns],
	);

	return {
		hiddenColumns,
		toggleColumn,
		setInternalHiddenColumns,
	};
}
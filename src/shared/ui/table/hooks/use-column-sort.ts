import { useCallback, useState } from 'react';
import type { ColumnEntity, TableStorage } from '../type';

export function useColumnSort<T>(
	columns: ColumnEntity<T>[],
	storage?: TableStorage,
	sortKey?: keyof T,
	sortDesc: boolean = false,
) {
	const [sort, setSort] = useState<{
		key?: keyof T | undefined;
		descending: boolean;
	}>({ key: sortKey, descending: sortDesc });

	const changeSort = useCallback((field: keyof T) => {
		setSort((v) => {
			if (v.key === field) {
				if (v.descending) {
					return { ...v, descending: false };
				} else {
					return {
						key: undefined,
						descending: true,
					};
				}
			} else {
				return {
					key: field,
					descending: true,
				};
			}
		});
	}, []);
	return {
		sort,
		changeSort,
	};
}
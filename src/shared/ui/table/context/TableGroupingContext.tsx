import { createSafeContext } from '../../../internal/utils/create-safe-context';
import type { TableDataProps, TableGroupLayout } from '../type';

export interface TableGroupingContext<T = object> {
	groupAt: TableDataProps['groupAt'];
	groupKeys: (keyof T)[];
	groupLayout: TableGroupLayout;
	/** Уровень вложенности TableData (0 — корневая таблица). */
	groupLevel: number;
	isGroupStart: boolean;
	groupColumnField?: keyof T;
	multiGroup: boolean;
}

const [Provider, useContext] = createSafeContext<TableGroupingContext<unknown>>(
	'TableGroupingContext was not found in the tree',
);

export function TableGroupingProvider<T = object>({
	children,
	value,
}: {
	value: TableGroupingContext<T>;
	children: React.ReactNode;
}): React.ReactNode {
	return <Provider value={value as TableGroupingContext<unknown>}>{children}</Provider>;
}

export function useTableGroupingContext<T = object>(): TableGroupingContext<T> {
	return useContext() as TableGroupingContext<T>;
}

import { type TableProps } from '@mantine/core';
import { createSafeContext } from '../../../internal/utils/create-safe-context';
import type {
	ColumnEntity,
	TableBulkAction,
	TableBulkActionsPanelProps,
	TableDataProps,
	TableNode,
	TableRowAction,
	TableRowActionsPanelProps,
	TableSortState,
} from '../type';

export interface TableDataContext<T = object> {
	breakpoint: boolean;
	props: TableProps;
	colspan: number;
	rowspan: number;
	editMode: TableDataProps<T>['editMode'];

	changeSort: (field: keyof T, options?: { multi?: boolean }) => void;
	sort: TableSortState<T>;
	multiSort: boolean;

	sortColumn: (dragField: keyof T, dropField: keyof T) => void;
	sortColumnSegment: (dragKey: string, dropKey: string, parentKey: string) => void;
	columnOrder: (keyof T)[];
	onColumnOrder: (columnOrder: (keyof T)[]) => void;

	hiddenColumns: (keyof T)[];
	toggleColumn: (column: ColumnEntity<T>, hidden?: boolean) => void;

	selectable?: TableDataProps<T>['selectable'];
	nodes: TableNode<T>[];

	handleModeChange: (item: TableNode<T>, column: ColumnEntity<T>) => void;

	updateNode: (index: TableNode<T>['index'], field: keyof T, value: T[keyof T]) => void;
	commitEdit: (index: TableNode<T>['index']) => void;

	editorMode: (item: TableNode<T>, column: ColumnEntity<T>) => boolean;
	clearModeChange: () => void;

	storage?: import('../type').TableStorage;

	rowActions?: TableRowAction<T>[];
	rowActionsPanel: React.FC<TableRowActionsPanelProps<T>>;
	rowActionsOnHover: boolean;
	rowActionsAt: NonNullable<TableDataProps['rowActionsAt']>;
	hasActionsColumn: boolean;
	bulkActions?: TableBulkAction<T>[];
	bulkActionsPanel: React.FC<TableBulkActionsPanelProps<T>>;
}

const [Provider, useContext] = createSafeContext<TableDataContext<unknown>>(
	'TableData component was not found in the tree',
);

export function TableDataProvider<T = object>({
	children,
	value,
}: {
	value: TableDataContext<T>;
	children: React.ReactNode;
}): React.ReactNode {
	return <Provider value={value as TableDataContext<unknown>}>{children}</Provider>;
}

export function useTableDataContext<T = object>(): TableDataContext<T> {
	return useContext() as TableDataContext<T>;
}

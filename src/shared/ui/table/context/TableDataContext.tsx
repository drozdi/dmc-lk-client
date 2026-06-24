import { type TableProps } from '@mantine/core';
import { createSafeContext } from "../../../internal/utils/create-safe-context";
import type {
	ColumnEntity,
	ExpandKind,
	TableDataProps,
	TableExpandablesState,
	TableExpandsState,
	TableGroupLayout,
	TableNode,
	TableRowAction,
	TableRowActionsPanelProps,
	TableBulkAction,
	TableBulkActionsPanelProps,
	TableSortState,
	ToggleExpandOptions,
} from "../type";

export interface TableDataContext<T = object> {
	breakpoint: boolean;
	props: TableProps;
	groupAt: TableDataProps['groupAt'];
	colspan: number;
	rowspan: number;
	editMode: TableDataProps<T>['editMode'];

	changeSort: (field: keyof T, options?: { multi?: boolean }) => void;
	sort: TableSortState<T>;
	multiSort: boolean;
	multiGroup: boolean;
	groupKeys: (keyof T)[];
	/** Уровень вложенности TableData (0 — корневая таблица). */
	groupLevel: number;
	groupLayout: TableGroupLayout;
	/** Поле group-only колонки — expand-all в заголовке только здесь. */
	groupColumnField?: keyof T;
	isGroupStart: boolean;

	expandables: TableExpandablesState;
	isExpanded: (expandKey: string, kind: ExpandKind) => boolean;
	toggleExpand: (
		expandKey: string | string[],
		kind: ExpandKind,
		options?: ToggleExpandOptions,
	) => void;
	expands: TableExpandsState;

	columnWidths?: Partial<Record<keyof T, number>>;
	resizeColumn: (column: ColumnEntity<T>, width: number, nextWidth: number) => void;
	getColumnWidth: (column: ColumnEntity<T>) => number | undefined;

	sortColumn: (dragIndex: number, dropIndex: number) => void;
	columnOrder: (keyof T)[];
	onColumnOrder: (columnOrder: (keyof T)[]) => void;

	hiddenColumns: (keyof T)[];
	toggleColumn: (column: ColumnEntity<T>, hidden?: boolean) => void;

	selectedRows: TableNode<T>['index'][];
	toggleRow: (index: TableNode<T>['index']) => void;
	selectAll: (selected: boolean) => void;
	isRowSelected: (index: TableNode<T>['index']) => boolean;
	someSelected: boolean;
	allSelected: boolean;
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
	"TableData component was not found in the tree"
);

export function TableDataProvider<T = object>({ children, value }: { value: TableDataContext<T>; children: React.ReactNode }): React.ReactNode {
	return <Provider value={value as TableDataContext<unknown>}>{children}</Provider>
}

export function useTableDataContext<T = object>(): TableDataContext<T> {
	return useContext() as TableDataContext<T>
}

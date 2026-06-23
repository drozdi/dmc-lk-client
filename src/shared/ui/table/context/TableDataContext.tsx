import { type TableProps } from '@mantine/core';
import { createSafeContext } from "../../../internal/utils/create-safe-context";
import type { ColumnEntity, TableDataProps, TableNode } from "../type";

export interface TableDataContext<T = object> {
	breakpoint: boolean;
	props: TableProps;
	groupAt: TableDataProps['groupAt'];
	colspan: number;
	rowspan: number;
	editMode: TableDataProps<T>['editMode'];

	changeSort: (field: keyof T) => void;
	sort: {
		key?: keyof T | undefined;
		descending: boolean;
	};

	expandables: TableNode<T>['index'][];
	toggleExpand: (index: TableNode<T>['index'] | TableNode<T>['index'][]) => void;
	expands: TableNode<T>['index'][];

	columnWidths?: Record<keyof T, number>;
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
	
	handleModeChange: (item: TableNode<T>, column: ColumnEntity<T>) => void;

	updateNode: (index: TableNode<T>['index'], field: keyof T, value: T[keyof T]) => void;
	commitEdit: (index: TableNode<T>['index']) => void;

	editorMode: (item: TableNode<T>, column: ColumnEntity<T>) => boolean;
	clearModeChange: () => void;

	storage: TableDataProps['storage'];
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

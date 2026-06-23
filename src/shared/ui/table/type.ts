import { type TableProps } from '@mantine/core';
import type { TablePaginationProps } from './ui/type';

/** Тип раскрытия строк: nested-таблица (group) или сгруппированные siblings (grouped). */
export type ExpandKind = 'group' | 'grouped';

export interface TableExpandsState<T = object> {
	group: TableNode<T>['index'][];
	grouped: TableNode<T>['index'][];
}

export interface TableExpandablesState<T = object> {
	group: TableNode<T>['index'][];
	grouped: TableNode<T>['index'][];
}

export interface SortRule<T = object> {
	key: keyof T;
	descending: boolean;
}

export interface TableSortState<T = object> {
	rules: SortRule<T>[];
	/** Первое правило — для обратной совместимости с одиночной сортировкой. */
	key?: keyof T;
	descending: boolean;
}

export interface TableNode<T = object> {
	data: T;
	index: string | number;
	isParent: boolean;
	isChildren: boolean;
	nodes: TableNode<T>[];
}

export interface TableDataProps<T = object> extends Omit<TableProps, 'layout' | 'data'> {
	breakpoint?: string;
	storage?: string | TableStorage;
	columns?: ColumnEntity<T>[];
	multiple?: boolean;

	limits?: number[];
	limit?: number;
	page?: number;

	columnOrder?: (keyof T)[];
	onColumnOrder?: (columnOrder: (keyof T)[]) => void;

	hiddenColumns?: (keyof T)[];
	onToggleColumn?: (column: ColumnEntity<T>, hidden?: boolean) => void;

	columnWidths?: Record<keyof T, number>;
	onColumnResize?: (column: ColumnEntity<T>, width: number, nextWidth: number) => void;

	selectable?: 'start' | 'end';
	selectedRows?: TableNode<T>['index'][];
	onSelectedRowsChange?: (selected: TableNode<T>['index'][]) => void;

	data:
		| T[]
		| ((input?: { limit: number; page: string | number }) => Promise<{
				data: T[];
				next: string | number;
				total?: number;
				pages?: number;
		  }>);
	total?: number;
	loading?: boolean;
	error?: React.ReactNode;
	withHeader?: boolean;
	withPagination?: boolean;
	groupAt?: 'start' | 'end';
	/** Явный список ключей группировки (порядок = уровни вложенности). */
	groupKeys?: (keyof T)[];
	sortKey?: keyof T;
	sortDesc?: boolean;
	/** Мульти-сортировка: Shift+клик или повторный клик добавляет правило. */
	multiSort?: boolean;
	sortRules?: SortRule<T>[];

	children?: React.ReactNode;
	editMode?: 'row' | 'cell';
	onRowEditComplete?: (item: T, index: TableNode<T>['index']) => void;
	layout?: React.FC<{
		nodes: TableNode<T>[];
		columns: ColumnEntity<T>[];
	}>;
	pagination?: React.FC<TablePaginationProps<T>>;
	minHeight?: number;
	noDataText?: string;
	level?: number;
}

export interface TableStorage {
	clear(): void;
	setItem(key: string, value: unknown): void;
	getItem(key: string): unknown | null;
	removeItem(key: string): void;
}

export interface DataColumnProps<T = object> {
	children?: React.ReactNode;
	id?: boolean;
	header?: React.ReactNode | ((column: ColumnEntity<T>) => React.ReactNode);
	body?: (item: T, column: ColumnEntity<T>) => React.ReactNode;
	// | React.FC<TableDataProps>;
	editor?: (
		item: T,
		column: ColumnEntity<T>,
		onChange: (value: T[keyof T]) => void,
		onSave: () => void,
	) => React.ReactNode;
	footer?: React.ReactNode | ((column: ColumnEntity<T>) => React.ReactNode);
	field: keyof T | `.${string}`;
	size?: number;
	headerStyle?: React.CSSProperties | ((column: ColumnEntity<T>) => React.CSSProperties);
	bodyStyle?:
		| React.CSSProperties
		| ((column: ColumnEntity<T>, node: TableNode<T>) => React.CSSProperties);
	rowStyle?:
		| React.CSSProperties
		| ((column: ColumnEntity<T>, node: TableNode<T>) => React.CSSProperties);
	footerStyle?: React.CSSProperties | ((column: ColumnEntity<T>) => React.CSSProperties);
	sortable?: boolean | ((column: ColumnEntity<T>) => boolean | void);
	toggleable?: boolean | ((column: ColumnEntity<T>) => boolean | void);
	resizable?: boolean;
	ellipsis?: boolean;
	noWrap?: boolean;
	draggable?: boolean;
	/**
	 * group — поле содержит вложенный массив строк (nested TableData при раскрытии).
	 * grouped — строки таблицы объединяются по значению поля (groupBy), siblings в node.nodes.
	 * Можно использовать одновременно на разных колонках: grouped сворачивает строки,
	 * group раскрывает вложенную таблицу в поле записи.
	 */
	group?: boolean;
	grouped?: boolean;
	align?: 'left' | 'right' | 'center';
	width?: number;
}

export interface ColumnEntity<T = object> extends DataColumnProps<T> {
	size: number;
	level: number;
	parentLevel: number;
	columns: ColumnEntity<T>[];
	isDraggable: boolean;
	isGroup: boolean;
	isGrouped: boolean;
	isSorted: boolean;
	isColumns: boolean;
	isHeader: boolean;
	isField: boolean;
	isEmpty: boolean;
	isToggleable: boolean;
	isResizable: boolean;
	isSelecting: boolean;
	colspan: number;
}
import { type TableProps } from '@mantine/core';
import type { TablePaginationProps } from './ui/type';

/** Тип раскрытия строк: nested-таблица (group) или сгруппированные siblings (grouped). */
export type ExpandKind = 'group' | 'grouped';

export interface ToggleExpandOptions {
	merge?: boolean;
	remove?: boolean;
}

export interface TableExpandsState {
	group: string[];
	grouped: string[];
}

export interface TableExpandablesState {
	group: string[];
	/** expandKey узлов, доступных для раскрытия на каждом уровне группировки. */
	groupedByLevel: Partial<Record<number, string[]>>;
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
	/** Уровень в цепочке groupKeys (0 — верхний). */
	groupLevel?: number;
	/** Уникальный ключ для состояния раскрытия (не совпадает с index). */
	expandKey?: string;
}

export interface TableRowAction<T = object> {
	id: string;
	label: React.ReactNode;
	icon?: React.ReactNode;
	color?: string;
	disabled?: boolean | ((node: TableNode<T>) => boolean);
	hidden?: boolean | ((node: TableNode<T>) => boolean);
	onClick: (item: T, node: TableNode<T>) => void;
}

export interface TableRowActionsPanelProps<T = object> {
	node: TableNode<T>;
	actions: TableRowAction<T>[];
}

export interface TableBulkActionsContext<T = object> {
	items: T[];
	nodes: TableNode<T>[];
	selectedIndexes: TableNode<T>['index'][];
}

export interface TableBulkAction<T = object> {
	id: string;
	label: React.ReactNode;
	icon?: React.ReactNode;
	color?: string;
	disabled?: boolean | ((context: TableBulkActionsContext<T>) => boolean);
	hidden?: boolean | ((context: TableBulkActionsContext<T>) => boolean);
	onClick: (context: TableBulkActionsContext<T>) => void;
}

export interface TableBulkActionsPanelProps<T = object> {
	context: TableBulkActionsContext<T>;
	actions: TableBulkAction<T>[];
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
	/** Мульти-группировка: поэтапное раскрытие вложенных таблиц. По умолчанию true при groupKeys.length > 1. */
	multiGroup?: boolean;
	sortKey?: keyof T;
	sortDesc?: boolean;
	/** Мульти-сортировка. По умолчанию true при groupKeys.length > 1. */
	multiSort?: boolean;
	sortRules?: SortRule<T>[];

	children?: React.ReactNode;
	editMode?: 'row' | 'cell';
	onRowEditComplete?: (item: T, index: TableNode<T>['index']) => void;
	/** Доступные действия со строкой (редактирование, удаление и т.д.). */
	rowActions?: TableRowAction<T>[];
	/** Кастомный рендер панели действий (hover или колонка). По умолчанию — TableRowActionsPanel. */
	rowActionsPanel?: React.FC<TableRowActionsPanelProps<T>>;
	/** Показывать панель действий при наведении на строку. По умолчанию true, если есть rowActions и нет колонки actions. */
	rowActionsOnHover?: boolean;
	/** Позиция hover-панели относительно строки. */
	rowActionsAt?: 'start' | 'end';
	/** Массовые действия над выделенными строками (панель в заголовке колонки actions). */
	bulkActions?: TableBulkAction<T>[];
	/** Кастомный рендер панели массовых действий. По умолчанию — TableBulkActionsPanel. */
	bulkActionsPanel?: React.FC<TableBulkActionsPanelProps<T>>;
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
	 * group — вложенный массив строк (nested TableData при раскрытии).
	 * grouped — строки объединяются по значению поля (groupBy), siblings в node.nodes.
	 * На одной колонке: `field` — скаляр для grouped; вложенные строки — в `groupItemsField`
	 * или по соглашению `{field}Items` (например department + departmentItems).
	 */
	group?: boolean;
	grouped?: boolean;
	/** Поле с массивом для group, если отличается от `{field}Items`. */
	groupItemsField?: keyof T;
	/**
	 * Колонка действий со строкой. Использует rowActions из TableData.
	 * actionsMenu — одна кнопка с выпадающим меню вместо inline-панели.
	 */
	actions?: boolean;
	actionsMenu?: boolean;
	/** Позиция колонки действий (по умолчанию rowActionsAt или 'end'). */
	actionsAt?: 'start' | 'end';
	/** Служебный флаг: виртуальная колонка для hover-панели (задаётся TableData). */
	actionsHover?: boolean;
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
	isActions: boolean;
	/** Нулевая колонка-слот для hover-панели (без DataColumn actions). */
	isHoverSlot: boolean;
	colspan: number;
}
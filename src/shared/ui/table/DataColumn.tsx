import { type TableNode } from "./TableData";

export interface DataColumnProps<T = object> {
	children?: React.ReactNode,
	id?: boolean,
	header?: React.ReactNode | ((column: ColumnEntity<T>) => React.ReactNode),
	body?: (item: T, column: ColumnEntity<T>) => React.ReactNode,
	editor?: (item: T, column: ColumnEntity<T>, onChange: ((value: T[ColumnEntity<T>['field']]) => void), onSave: (() => void)) => React.ReactNode,
	footer?: React.ReactNode | ((column: ColumnEntity<T>) => React.ReactNode),
	field: keyof T,
	size?: number,
	style?: React.CSSProperties | ((column: ColumnEntity<T>, type: TableNode<T> | 'header' | 'body' | 'footer') => React.CSSProperties),
	sortable?: boolean | ((column: ColumnEntity<T>) => boolean | void),
	toggleable?: boolean | ((column: ColumnEntity<T>) => boolean | void),
	ellipsis?: boolean,
	noWrap?: boolean,
	isGroup?: boolean,
	isGrouped?: boolean,
	align?: "left" | "right" | "center",
}

export interface ColumnEntity<T = object> extends DataColumnProps<T> {
	size: number,
	level: number,
	parentLevel: number,
	columns: ColumnEntity<T>[],
	isSorted: boolean,
	isColumns: boolean,
	isHeader: boolean,
	isField: boolean,
	isEmpty: boolean,
	isToggleable: boolean,
	colspan: number,
}

export function DataColumn<T = object>(props: DataColumnProps<T>): null {
	return null;
};

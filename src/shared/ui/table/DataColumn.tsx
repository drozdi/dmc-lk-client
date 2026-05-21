import { useId } from "@mantine/hooks";
import { Children, useEffect } from "react";
import { useDataColumnsContext } from "./context/DataColumnsContext";
import { type TableNode } from "./TableData";

const calculateColspan = (children) => {
	if (!children) {
		return 1;
	}
	return Children.toArray(children).reduce((sum, child) => {
		return sum + calculateColspan(child.props.children);
	}, 0);
};
const calculateIsColumns = (children) => {
	if (!children) return false;
	return Children.count(children) > 0;
};

let id = 0;

export interface DataColumnProps<T = object> {
	children?: React.ReactNode,
	id?: boolean,
	header?: React.ReactNode,
	footer?: string,
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
	render?: (column: ColumnEntity<T>) => React.ReactNode,
	body?: (item: T, column: ColumnEntity<T>) => React.ReactNode,
	editor?: (item: T, column: ColumnEntity<T>, onChange: ((value: T[ColumnEntity<T>['field']]) => void), onSave: (() => void)) => React.ReactNode,
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
	const ctx = useDataColumnsContext();
	const uid = useId();

	const registerColumns = (column: {
		props: DataColumnProps<T>,
	}, level = 0, uid: string) => {
		const col: ColumnEntity<T> = {
			uid: uid,
			size: 1,
			level: level + 1,
			parentLevel: level,
			columns: [],
			isColumns: calculateIsColumns(column.props.children),
			isHeader: !!column.props.header,
			isField: !!column.props.field,
			isEmpty: !column.props.field,
			isSorted: !!column.props.sortable,
			isToggleable: !!column.props.toggleable,
			colspan:
				calculateColspan(column.props.children) ||
				column.props.size ||
				1,
			...column.props,
			children: undefined,
		};

		if (column.props.children) {
			Children.forEach(column.props.children, (child) => {
				col.columns.push(
					registerColumns(child as {
						props: DataColumnProps<T>,
					}, col.level, uid)
				);
			});
		}

		level === 0 && ctx.addColumn(col);

		return col;
	};

	useEffect(() => {
		registerColumns({ props }, 0, uid);
	}, [props]);

	return null;
};

import { useId } from "@mantine/hooks";
import { Children, useEffect } from "react";
import { useXTableColumsContext } from "./XTableColumsContext";

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

export interface XColumnProps<T = object> {
	children?: React.ReactNode,
	header?: string,
	footer?: string,
	field: keyof T,
	size?: number,
	sortable?: boolean,
	isGroup?: boolean,
	isGrouped?: boolean,
	isSorted?: boolean,
	align?: "left" | "right" | "center",
	body?: (item: T, column: ColumnEntity<T>) => React.ReactNode,
	edit?: (item: T, column: ColumnEntity<T>) => React.ReactNode,
}

export interface ColumnEntity<T = object> extends XColumnProps<T> {
	uid: string,
	size: number,
	level: number,
	parentLevel: number,
	columns: ColumnEntity<T>[],
	isColumns: boolean,
	isHeader: boolean,
	isField: boolean,
	isEmpty: boolean,
	colspan: number,
}

export function XColumn<T = object>(props: XColumnProps<T>): null {
	const ctx = useXTableColumsContext();
	const uid = useId();

	const registerColumns = (column: {
		props: XColumnProps<T>,
	}, level = 0, uid: string) => {
		const col: ColumnEntity<T> = {
			uid: `${uid}-${id++}`,
			size: 1,
			level: level + 1,
			parentLevel: level,
			columns: [],
			isColumns: calculateIsColumns(column.props.children),
			isHeader: !!column.props.header,
			isField: !!column.props.field,
			isEmpty: !column.props.field,
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
						props: XColumnProps<T>,
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

import { useMemo } from "react";
import { type ColumnEntity } from "../XColumn";
import { type TableNode } from "../XTable";
import { TableBodyRow } from "./TableBodyRow";

export interface TableBodyProps<T = object> {
	data: TableNode<T>[];
	columns: ColumnEntity<T>[];
}

export function TableBody<T = object>({data, columns}: TableBodyProps<T>) {
		const grouped = useMemo<ColumnEntity<T> | undefined>(() => {
			return columns.find((v) => v.isGrouped);
		}, [columns]);

		const fields = useMemo<ColumnEntity<T>[]>(() => {
			let ret: ColumnEntity<T>[] = [];
			(function recursive(columns: ColumnEntity<T>[]) {
				for (const column of columns) {
					if (column.isEmpty && column.isColumns) {
						recursive(column.columns);
					} else {
						ret.push(column);
					}
				}
			})(columns);
			
			return ret.filter(
				(v) =>
					v.field &&
					(grouped?.isGrouped || v.field != grouped?.field)
			);
		}, [columns, grouped]);


		

		return <>{data.map((item, index) => {
			return <TableBodyRow<T> item={item} columns={fields} key={index} />;
		})}</>
}
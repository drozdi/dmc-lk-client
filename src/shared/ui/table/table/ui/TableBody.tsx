import { useCallback, useMemo } from "react";
import { type ColumnEntity } from "../XColumn";
import { TableBodyRow } from "./TableBodyRow";

export interface TableBodyProps<T = object> {
	data: T[];
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


		const primaryKey = useMemo<string[]>(() => {
			return fields.filter(v => v.id).map(v => v.field)
		}, [fields])

		const genId = useCallback((item: T, index) => {
			if (primaryKey.length) {
				const ret = []
				for (const key of primaryKey) {
					res.push(item[key] || '')
				}
				return ret.join("_")
			}
			return index;
		}, [primaryKey])

		return <>{data.map((item, index) => {
			return <TableBodyRow<T> item={item} columns={fields} key={index} />;
		})}</>
}
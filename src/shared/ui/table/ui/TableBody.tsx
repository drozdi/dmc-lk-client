import { useTableDataContext } from '../context';
import { type ColumnEntity } from "../DataColumn";
import { type TableNode } from '../type';
import { TableBodyRow } from "./body/row";

export interface TableBodyProps<T = object> {
	nodes: TableNode<T>[];
	columns: ColumnEntity<T>[];
	level?: number;
}

export function TableBody<T = object>({ nodes, columns, level }: TableBodyProps<T>) {
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

		return <>{nodes.map((node) => {
			return <TableBodyRow<T> node={node} columns={fields} key={node.index} level={level} />;
		})}</>
}
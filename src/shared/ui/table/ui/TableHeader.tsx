import { Table } from '@mantine/core';
import { useCallback, useMemo } from 'react';
import { type ColumnEntity } from '../DataColumn';
import { useTableDataContext } from '../context/TableDataContext';
import { TableHeaderCell } from './TableHeaderCell';

export interface TableHeaderProps<T = object> {
	columns: ColumnEntity<T>[];
}

export function TableHeader<T = object>({ columns }:TableHeaderProps<T>) {
	const { changeSort, rowspan, colspan } = useTableDataContext();
	
	const onToggle = useCallback((column: ColumnEntity<T>) => {
		column.toggleable?.(column)
	}, []);
	const onSort = useCallback((column: ColumnEntity<T>) => {
		// column.sortable?.(column)
		changeSort(column.field)
	}, []);
	const onExpand = useCallback((column: ColumnEntity<T>) => {

	}, []);

	const onSelected = useCallback((column: ColumnEntity<T>) => {

	}, []);

	const rows = useMemo(() => {
		const rows = [];
		(function recursive(columns, level) {
			rows[level] = (rows[level] || []).concat(
				columns
					.map((column) => {
						if (column.isColumns && column.isHeader) {
							recursive(column.columns, level + 1);
						} else if (column.isColumns) {
							return column.columns.map(column =>
								<TableHeaderCell<T> key={column.field as string} maxRow={rowspan} maxCol={colspan} column={column} onToggle={onToggle} onSort={onSort} onExpand={onExpand} onSelected={onSelected} />
							);
						}
						if (column.isGrouped) {
							return <TableHeaderCell<T> key={column.field as string} maxRow={rowspan} maxCol={colspan} column={column} onToggle={onToggle} onSort={onSort} onExpand={onExpand} onSelected={onSelected} />;
						}
						if (column.isGroup) {
							return <TableHeaderCell<T> key={column.field as string} maxRow={rowspan} maxCol={colspan} column={column} onToggle={onToggle} onSort={onSort} onExpand={onExpand} onSelected={onSelected} />;
						}
						if (column.isHeader) {
							return <TableHeaderCell<T> key={column.field as string} maxRow={rowspan} maxCol={colspan} column={column} onToggle={onToggle} onSort={onSort} onExpand={onExpand} onSelected={onSelected} />;
						}
						return null;
					})
			);
		})(columns, 0);

		return rows;
	}, [columns, onToggle, onSort, onExpand]);

	return rows.map((row, index) => (
		<Table.Tr key={index} role="row">
			{row}
		</Table.Tr>
	));
}
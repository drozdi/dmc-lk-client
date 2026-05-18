import { Table } from '@mantine/core';
import { useCallback, useMemo } from 'react';
import { type ColumnEntity } from '../XColumn';
import { TableHeaderCell } from './TableHeaderCell';

export interface TableHeaderProps<T = object> {
	columns: ColumnEntity<T>[];
}

export function TableHeader<T = object>({ columns }:TableHeaderProps<T>) {
	const rowspan = useMemo(() => {
		let max = 0;
		(function recursive(columns: ColumnEntity<T>[]) {
			for ( const column of columns ) {
				max = max > column.level ? max : column.level;
				if (column.isColumns) {
					recursive(column.columns);
				}
			}
		})(columns);
		return max;
	}, [columns]);

	const colspan = useMemo(
		() =>
			columns.reduce((sum: number, column: ColumnEntity<T>) => {
				return sum + (column.isGroup ? 0 : column.colspan);
			}, 0) || 1,
		[columns]
	);

	const onToggle = useCallback((column: ColumnEntity<T>) => {
		column.toggleable?.(column)
	}, []);
	const onSort = useCallback((column: ColumnEntity<T>) => {
		column.sortable?.(column)
	}, []);
	const onExpand = useCallback((column: ColumnEntity<T>) => {

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
							return column.columns.map(TableHeaderCell({ column, onToggle, onSort, onExpand }));
						}
						if (column.isGrouped) {
							return TableHeaderCell({ column, onToggle, onSort, onExpand });
						}
						if (column.isHeader && !column.isGroup) {
							return TableHeaderCell({ column, onToggle, onSort, onExpand });
						}
						return null;
					})
			);
		})(columns, 0);
		return rows;
	}, [columns]);

	return rows.map((row, index) => (
			<Table.Tr key={index} role="row">
				{row}
			</Table.Tr>
		));
}
import { Table } from '@mantine/core';
import { useMemo } from 'react';
import { type ColumnEntity } from '../XColumn';
import { TableHeaderCell } from './TableHeaderCell';

export interface TableHeaderProps<T = object> {
	columns: ColumnEntity<T>[];
}

export function TableHeader<T = object>({ columns }:TableHeaderProps<T>) {
	console.log(columns)
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

	const rows = useMemo(() => {
		const rows = [];
		(function recursive(columns, level) {
			rows[level] = (rows[level] || []).concat(
				columns
					.map((column) => {
						if (column.isColumns && column.isHeader) {
							recursive(column.columns, level + 1);
						} else if (column.isColumns) {
							return column.columns.map(TableHeaderCell(column));
						}
						if (column.isGrouped) {
							return TableHeaderCell(column);
						}
						if (column.isHeader && !column.isGroup) {
							return TableHeaderCell(column);
						}
						return null;
					})
			);
		})(columns, 0);
		return rows;
	}, [columns]);
		console.log(rows)
		return rows.map((row, index) => (
			<Table.Tr key={index} role="row">
				{row}
			</Table.Tr>
		));
}
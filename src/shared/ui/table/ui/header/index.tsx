import { Table } from '@mantine/core';
import { useMemo } from 'react';
import { useTableDataContext } from '../../context/TableDataContext';
import type { TableHeaderProps } from '../type';
import { TableHeaderCell } from './cell';

export * from './bulk-actions';
export * from './hover-slot-cell';
export * from './actions-cell';
export * from './cell';
export * from './cell-drager';
export * from './cell-expander';
export * from './cell-resizer';
export * from './cell-slot';
export * from './cell-sorter';
export * from './cell-toggler';
export * from './cell-wrap';
export * from './group';
export * from './selector';

export function TableHeader<T = object>({ columns }: TableHeaderProps<T>) {
	const { rowspan, colspan } = useTableDataContext<T>();

	const rows = useMemo(() => {
		const rows: React.ReactNode[] = [];
		(function recursive(columns, level) {
			rows[level] = (rows[level] || []).concat(
				columns.map((column) => {
					if (column.isColumns && column.isHeader) {
						recursive(column.columns, level + 1);
					} else if (column.isColumns) {
						return column.columns.map((column) => (
							<TableHeaderCell<T>
								key={column.field as string}
								maxRow={rowspan}
								maxCol={colspan}
								column={column}
							/>
						));
					}
					if (
						column.isGrouped ||
						column.isGroup ||
						column.isHeader ||
						column.isSelecting ||
						column.isActions ||
						column.isHoverSlot
					) {
						return (
							<TableHeaderCell<T>
								key={column.field as string}
								maxRow={rowspan}
								maxCol={colspan}
								column={column}
							/>
						);
					}
					return null;
				}),
			);
		})(
			columns,
			0,
		);

		return rows;
	}, [columns]);

	return rows.map((row, index) => (
		<Table.Tr key={index} role="row">
			{row}
		</Table.Tr>
	));
}

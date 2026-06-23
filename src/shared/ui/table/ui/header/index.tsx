import { Table } from '@mantine/core';
import { useMemo } from 'react';
import { useTableDataContext } from '../../context/TableDataContext';
import type { ColumnEntity } from '../../type';
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

function shouldRenderHeaderCell<T>(column: ColumnEntity<T>): boolean {
	return (
		column.isGrouped ||
		column.isGroup ||
		column.isHeader ||
		column.isSelecting ||
		column.isActions ||
		column.isHoverSlot
	);
}

export function TableHeader<T = object>({ columns }: TableHeaderProps<T>) {
	const { rowspan, colspan } = useTableDataContext<T>();

	const rows = useMemo(() => {
		const result: React.ReactNode[][] = [];

		function recursive(cols: ColumnEntity<T>[], level: number) {
			if (!result[level]) {
				result[level] = [];
			}

			for (const column of cols) {
				if (column.isColumns && column.isHeader) {
					recursive(column.columns, level + 1);
					continue;
				}

				if (column.isColumns) {
					for (const child of column.columns) {
						result[level]!.push(
							<TableHeaderCell<T>
								key={child.field as string}
								maxRow={rowspan}
								maxCol={colspan}
								column={child}
							/>,
						);
					}
					continue;
				}

				if (shouldRenderHeaderCell(column)) {
					result[level]!.push(
						<TableHeaderCell<T>
							key={column.field as string}
							maxRow={rowspan}
							maxCol={colspan}
							column={column}
						/>,
					);
				}
			}
		}

		recursive(columns, 0);
		return result;
	}, [columns, rowspan, colspan]);

	return rows.map((row, index) => (
		<Table.Tr key={index} role="row">
			{row}
		</Table.Tr>
	));
}

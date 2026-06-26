import { Table } from '@mantine/core';
import { useMemo } from 'react';
import { useTableColumnSizingContext } from '../../context';
import type { TableHeaderCellWrapProps } from '../type';
import { useColumnDrag } from './use-column-drag';

export { useColumnDrag } from './use-column-drag';

export function TableHeaderCellWrap<T = object>({
	column,
	maxCol,
	maxRow,
	children,
	className,
}: TableHeaderCellWrapProps<T>) {
	const { getColumnWidth } = useTableColumnSizingContext<T>();
	const rowspan = column.isColumns ? 1 : maxRow - column.parentLevel;
	const dragProps = useColumnDrag<T>(column);

	const headerStyle = useMemo(() => {
		return typeof column.headerStyle === 'function'
			? column.headerStyle(column)
			: column.headerStyle || {};
	}, [column]);

	const isGroupOnlyHeader = column.isGroup && !column.isGrouped;
	const storedWidth = getColumnWidth(column);

	return (
		<Table.Th
			className={className}
			pos="relative"
			colSpan={column.colspan}
			rowSpan={rowspan}
			w={
				column.isHoverSlot
					? 0
					: column.isSelecting
						? (storedWidth ?? 44)
						: isGroupOnlyHeader
							? (storedWidth ?? undefined)
							: storedWidth
			}
			miw={isGroupOnlyHeader && storedWidth == null ? 'var(--table-select-column-width, 2.75rem)' : undefined}
			style={{
				...headerStyle,
				backgroundColor: dragProps.bg ?? headerStyle.backgroundColor,
			}}
			role="columnheader"
			{...(dragProps.draggable ? dragProps : {})}
		>
			{children}
		</Table.Th>
	);
}

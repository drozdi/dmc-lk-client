import { Table } from '@mantine/core';
import { useMemo, useState } from 'react';
import { useTableDataContext, useTableColumnSizingContext } from '../../context';
import { isColumnGroupHeader, isColumnOrderReorderable } from '../../utils/column-fields';
import type { ColumnEntity } from '../../type';
import type { TableHeaderCellWrapProps } from '../type';

export function useDraggable<T = object>(
	column: ColumnEntity<T>,
	color: string = 'gray',
): {
	bg?: string;
	draggable: boolean;
	onDragStart?: (e: React.DragEvent) => void;
	onDragEnd?: (e: React.DragEvent) => void;
	onDragOver?: (e: React.DragEvent) => void;
	onDragLeave?: (e: React.DragEvent) => void;
	onDrop?: (e: React.DragEvent) => void;
} {
	const [hovered, setHovered] = useState(false);
	const { sortColumn } = useTableDataContext<T>();

	const enabled =
		!!column.isDraggable &&
		isColumnOrderReorderable(column) &&
		!column.isActions &&
		!column.isHoverSlot &&
		!!column.field;

	return useMemo(() => {
		if (!enabled) {
			return { draggable: false as const };
		}
		return {
			bg: hovered ? color : undefined,
			draggable: true as const,
			onDragStart: (e: React.DragEvent) => {
				e.dataTransfer.setData('text/plain', column.field as string);
				e.dataTransfer.effectAllowed = 'move';
			},
			onDragEnd: () => {
				setHovered(false);
			},
			onDragOver: (e: React.DragEvent) => {
				e.preventDefault();
				e.dataTransfer.dropEffect = 'move';
				setHovered(true);
			},
			onDragLeave: () => {
				setHovered(false);
			},
			onDrop: (e: React.DragEvent) => {
				e.preventDefault();
				const draggedField = e.dataTransfer.getData('text/plain') as keyof T;
				if (!draggedField || draggedField === column.field) {
					setHovered(false);
					return;
				}
				sortColumn(draggedField, column.field as keyof T);
				setHovered(false);
			},
		};
	}, [enabled, hovered, color, column, sortColumn]);
}

export function TableHeaderCellWrap<T = object>({
	column,
	maxCol,
	maxRow,
	children,
	className,
}: TableHeaderCellWrapProps<T>) {
	const { getColumnWidth } = useTableColumnSizingContext<T>();
	const rowspan = column.isColumns ? 1 : maxRow - column.parentLevel;
	const dragProps = useDraggable<T>(column);

	const headerStyle = useMemo(() => {
		return typeof column.headerStyle === 'function'
			? column.headerStyle(column)
			: column.headerStyle || {};
	}, [column]);

	return (
		<Table.Th
			className={className}
			pos="relative"
			colSpan={column.colspan}
			rowSpan={rowspan}
			w={column.isHoverSlot ? 0 : column.isSelecting ? (getColumnWidth(column) ?? 44) : getColumnWidth(column)}
			style={headerStyle}
			role="columnheader"
			{...(isColumnGroupHeader(column) ? {} : dragProps)}
		>
			{children}
		</Table.Th>
	);
}

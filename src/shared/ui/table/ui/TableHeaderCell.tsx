import { ActionIcon, Box, Group, Table } from '@mantine/core';
import { useRef } from 'react';
import { TbChevronDown, TbChevronUp, TbSelector, TbX } from 'react-icons/tb';
import { type ColumnEntity } from '../DataColumn';
import { useTableDataContext } from '../context/TableDataContext';
import classes from './style.module.css';

const MIN_COLUMN_WIDTH = 50;

export interface BaseCellProps<T = object> {
	column: ColumnEntity<T>
	maxRow: number
	maxCol: number
	onToggle?: (column: ColumnEntity<T>) => void
	onSort?: (column: ColumnEntity<T>) => void
	onExpand?: (column: ColumnEntity<T>) => void
	onSelected?: (column: ColumnEntity<T>) => void
	onResize?: (column: ColumnEntity<T>, width: number, nextWidth: number) => void
}

export interface TableHeaderCellProps<T = object> extends BaseCellProps<T> {
	
}
export interface TableHeaderCellSlotProps<T = object> extends Omit<BaseCellProps<T>, 'maxRow' | 'maxCol'> {

}
export interface TableHeaderCellSortProps<T = object> extends BaseCellProps<T> {
	onClick?: BaseCellProps<T>['onSort']
}
export interface TableHeaderCellToggleableProps<T = object> extends BaseCellProps<T> {
	onClick?: BaseCellProps<T>['onToggle']
}
export interface TableHeaderCellExpandProps<T = object> extends BaseCellProps<T> {
	onClick?: BaseCellProps<T>['onExpand']
}
export interface TableHeaderCellResizeProps<T = object> extends Omit<BaseCellProps<T>, 'maxRow' | 'maxCol'> {

}

export interface TableHeaderCellWrapProps<T = object> extends BaseCellProps<T> {
	children?: React.ReactNode
}

export function TableHeaderCellWrap<T = object>({ maxCol, maxRow, column, children }: TableHeaderCellWrapProps<T>) {
	return <Table.Th
		pos='relative'
		colSpan={column.colspan}
		rowSpan={
			column.isColumns ? 1 : maxRow - column.parentLevel
		}
		w={column.isGroup? 72: undefined}
		style={typeof column.style === 'function'? column.style(column, 'header'): column.style}
		role="columnheader"				
	>
		{children}
	</Table.Th>
}


export function TableHeaderCellSlot<T = object>({ column }: TableHeaderCellSlotProps<T>)  {
	return <p style={{
		overflow: column.ellipsis? 'hidden': undefined,
		textOverflow: column.ellipsis? 'ellipsis': undefined,
		whiteSpace: column.noWrap? 'nowrap': undefined
	}}>{typeof column.header === 'function'? column.header(column): column.header}</p>
}

export function TableHeaderCellSort<T = object>({ column, onClick }: TableHeaderCellSortProps<T>)  {
	if (!column.isSorted) {
		return "";
	}
	const { sort } = useTableDataContext()
	return (
		<ActionIcon variant="subtle" size='xs' role="img" aria-label={`Sorted`} onClick={() => onClick?.(column)}
		// aria-label={`Sorted ${sort.descending ? 'descending' : 'ascending'}`}
		>
			{sort.key === column.field ? 
				sort.descending ? <TbChevronDown /> : <TbChevronUp />
			: <TbSelector />}
		</ActionIcon>
	);
}

export function TableHeaderCellToggleable<T = object>({ column, onClick }: TableHeaderCellToggleableProps<T>)  {
	if (!column.isToggleable) {
		return "";
	}
	return (
		<ActionIcon variant="subtle" size='xs' role="img" aria-label="Toggle column" onClick={() => onClick?.(column)}>
			<TbX />
		</ActionIcon>
	);
}

export function TableHeaderCellExpand<T = object>({ column, maxRow, maxCol } : TableHeaderCellExpandProps<T>)  {
	return (
		<TableHeaderCellWrap<T> column={column} maxRow={maxRow} maxCol={maxCol}>
			<TableHeaderCellSlot<T> column={column} />
		</TableHeaderCellWrap>
	);
}

export function TableHeaderCellResize<T = object> ({
	column,
	onResize
}: TableHeaderCellResizeProps<T>) {
	if (!column.isResizable) {
		return "";
	}
	const columnRef = useRef<HTMLDivElement>(null);
	const dragState = useRef<{
		startX: number,
		currentWidth: number, 
		nextWidth: number
	}>({
		startX: 0,
		currentWidth: 0, 
		nextWidth: 0 
	});

	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
 		e.preventDefault();
    e.stopPropagation();
		if (!columnRef.current) {
			return;
		}

		const th = columnRef.current.closest('th')
		const nextTh = th?.nextElementSibling as HTMLTableCellElement;
		if (!th) {
			return;
		}

		dragState.current = {
			startX: e.clientX,
      currentWidth: th?.offsetWidth,
      nextWidth: nextTh?.offsetWidth,
    };

		const handleMouseMove = (event: MouseEvent) => {
			let deltaX = event.clientX - dragState.current.startX;

      const maxShrinkCurrent = dragState.current.currentWidth - MIN_COLUMN_WIDTH;
      const maxShrinkNext = dragState.current.nextWidth - MIN_COLUMN_WIDTH;

      const constrainedDelta = Math.max(-maxShrinkCurrent, Math.min(deltaX, maxShrinkNext));

      const finalCurrentWidth = dragState.current.currentWidth + constrainedDelta;
      const finalNextWidth = (dragState.current.nextWidth || 0) - constrainedDelta;
			
			
			th.style.width = `${finalCurrentWidth}px`
			if (nextTh) {
				nextTh.style.width = `${finalNextWidth}px`
			}
			onResize?.(column, finalCurrentWidth, finalNextWidth)
		};

    const handleMouseUp = () => {
			document.body.style.cursor = 'initial';
      document.body.style.userSelect = 'initial';
      
			document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
			window.removeEventListener('blur', handleMouseUp);
    };

		document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
		window.addEventListener('blur', handleMouseUp);
	}

	return <Box 
		ref={columnRef} 
		className={classes.resize}
		onMouseDown={handleMouseDown}
		onClick={(event) => event.stopPropagation()} />
}


export function TableHeaderCell<T = object>({ maxRow, maxCol, column, onToggle,	onSort,	onExpand, onResize, onSelected }: TableHeaderCellProps<T>) {
	if (column.isGroup) {
		return <TableHeaderCellExpand<T> column={column} maxRow={maxRow} maxCol={maxCol} onExpand={onExpand} />;
	}
	return (
		<TableHeaderCellWrap<T> column={column} maxRow={maxRow} maxCol={maxCol} >
			<Group justify={
				column.align === 'right'? 'flex-end': column.align === 'left'? 'flex-strart' : column.align === 'center'? 'center': 'space-between'
			}  wrap='nowrap' gap='0'>
				<TableHeaderCellSlot<T> column={column} />
				<Group flex='0' gap='0' justify='flex-end' wrap="nowrap">
					<TableHeaderCellSort<T> column={column} onClick={onSort} maxRow={maxRow} maxCol={maxCol} />
					<TableHeaderCellToggleable<T> column={column} onClick={onToggle} maxRow={maxRow} maxCol={maxCol} />
				</Group>
			</Group>
			<TableHeaderCellResize<T> column={column} onResize={onResize} />
		</TableHeaderCellWrap>
	);
}
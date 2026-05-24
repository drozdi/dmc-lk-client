import { ActionIcon, Group, Table } from '@mantine/core';
import { TbChevronDown, TbChevronUp, TbSelector, TbX } from 'react-icons/tb';
import { type ColumnEntity } from '../DataColumn';
import { useTableDataContext } from '../context/TableDataContext';

export interface BaseCellProps<T = object> {
	column: ColumnEntity<T>
	maxRow: number
	maxCol: number
	onToggle?: (column: ColumnEntity<T>) => void
	onSort?: (column: ColumnEntity<T>) => void
	onExpand?: (column: ColumnEntity<T>) => void
	onSelected?: (column: ColumnEntity<T>) => void
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

export interface TableHeaderCellWrapProps<T = object> extends BaseCellProps<T> {
	children?: React.ReactNode
}

export function TableHeaderCellWrap<T = object>({ maxCol, maxRow, column, children }: TableHeaderCellWrapProps<T>) {
	return <Table.Th
		colSpan={column.colspan}
		rowSpan={
			column.isColumns ? 1 : maxRow - column.parentLevel
		}
		style={typeof column.style === 'function'? column.style(column, 'header'): column.style || {}}
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

export function TableHeaderCellExpand<T = object>({ column, maxRow } : TableHeaderCellExpandProps<T>)  {
	return (
		<Table.Th
				colSpan={column.colspan}
				rowSpan={column.isColumns ? 1 : maxRow - column.parentLevel}
				style={
					column.style || {
						width: 72,
					}
				}
				role="columnheader"
			>
				<TableHeaderCellSlot<T> column={column} />
			</Table.Th>
	);
}


export function TableHeaderCell<T = object>({ maxRow, maxCol, column, onToggle,	onSort,	onExpand, onSelected }: TableHeaderCellProps<T>) {
	if (column.isGroup) {
		return <TableHeaderCellExpand<T> column={column} maxRow={maxRow} maxCol={maxCol} />;
	}
	return (
		<TableHeaderCellWrap<T> column={column} maxRow={maxRow} maxCol={maxCol} >
			<Group justify='space-between' wrap='nowrap' gap='0'>
				<TableHeaderCellSlot<T> column={column} />
				<Group flex='0' gap='0' justify='flex-end' wrap="nowrap">
					<TableHeaderCellSort<T> column={column} onClick={onSort} maxRow={maxRow} maxCol={maxCol} />
					<TableHeaderCellToggleable<T> column={column} onClick={onToggle} maxRow={maxRow} maxCol={maxCol} />
				</Group>
			</Group>
		</TableHeaderCellWrap>
	);
}
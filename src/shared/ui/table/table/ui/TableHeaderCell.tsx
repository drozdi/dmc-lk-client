import { ActionIcon, Group, Table } from '@mantine/core';
import { TbArrowDown, TbArrowsVertical, TbArrowUp, TbX } from 'react-icons/tb';
import { type ColumnEntity } from '../XColumn';
import { useXTableContext } from '../XTableContext';

export interface BaseCellProps<T = object> {
	column: ColumnEntity<T>
	maxRow: number
	maxCol: number
	onToggle?: (column: ColumnEntity<T>) => void
	onSort?: (column: ColumnEntity<T>) => void
	onExpand?: (column: ColumnEntity<T>) => void
}

export interface TableHeaderCellProps<T = object> extends BaseCellProps<T> {
	
}
export interface TableHeaderCellSlotProps<T = object> extends BaseCellProps<T> {

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


function TableHeaderCellSlot<T = object>({column}: TableHeaderCellSlotProps<T>)  {
	return <p style={{
		overflow: column.ellipsis? 'hidden': '',
		textOverflow: column.ellipsis? 'ellipsis': '',
		whiteSpace: column.noWrap? 'nowrap': ''
	}}>{column.render?.(column) || column.header}</p>
}

function TableHeaderCellSort<T = object>({ column, onClick }: TableHeaderCellSortProps<T>)  {
	if (!column.isSorted) {
		return "";
	}
	const { sort } = useXTableContext()
	return (
		<ActionIcon variant="subtle" size='xs' role="img" aria-label={`Sorted`} onClick={() => onClick?.(column)}
		// aria-label={`Sorted ${sort.descending ? 'descending' : 'ascending'}`}
		>
			{sort.key === column.field ? 
				sort.descending ? <TbArrowDown /> : <TbArrowUp />
			: <TbArrowsVertical />}
		</ActionIcon>
	);
}

function TableHeaderCellToggleable<T = object>({ column, onClick }: TableHeaderCellToggleableProps<T>)  {
	if (!column.isToggleable) {
		return "";
	}
	return (
		<ActionIcon variant="subtle" size='xs' role="img" aria-label="Toggle column" onClick={() => onClick?.(column)}>
			<TbX />
		</ActionIcon>
	);
}

function TableHeaderCellExpand<T = object>({ column, maxRow } : TableHeaderCellExpandProps<T>)  {
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
				{TableHeaderCellSlot<T>({column})}
			</Table.Th>
	);
}

export function TableHeaderCell<T = object>({ maxRow, maxCol, column, onToggle,	onSort,	onExpand }: TableHeaderCellProps<T>) {
	if (column.isGrouped) {
		return <TableHeaderCellExpand<T> column={column} maxRow={maxRow} maxCol={maxCol} />;
	}
	return (
		<Table.Th
			colSpan={column.colspan}
			rowSpan={
				column.isColumns ? 1 : maxRow - column.parentLevel
			}
			style={column.style || {}}
			role="columnheader"
		>
			<Group justify='space-between' wrap='nowrap' gap='0'>
				<TableHeaderCellSlot<T> column={column} maxRow={maxRow} maxCol={maxCol} />
				<Group flex='0' gap='0' justify='flex-end' wrap="nowrap">
					<TableHeaderCellSort<T> column={column} onClick={onSort} maxRow={maxRow} maxCol={maxCol} />
					<TableHeaderCellToggleable<T> column={column} onClick={onToggle} maxRow={maxRow} maxCol={maxCol} />
				</Group>
			</Group>
		</Table.Th>
	);
}
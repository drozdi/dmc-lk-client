import { ActionIcon, Group, Table, Text } from '@mantine/core';
import { TbArrowDown, TbArrowsVertical, TbArrowUp, TbX } from 'react-icons/tb';
import { type ColumnEntity } from '../XColumn';

export interface BaseCellProps<T = object> {
	column: ColumnEntity<T>
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
	return <Text>{column.render?.(column) || column.header}</Text>
}

function TableHeaderCellSort<T = object>({ column, onClick }: TableHeaderCellSortProps<T>)  {
	if (!column.sortable) {
		return "";
	}
	return (
		<ActionIcon variant="subtle" size='xs' role="img" aria-label={`Sorted`} onClick={onClick}
		// aria-label={`Sorted ${sortStatus.direction === 'desc' ? 'descending' : 'ascending'}`}
		>
			<TbArrowsVertical />
			<TbArrowUp />
			<TbArrowDown />
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

function TableHeaderCellExpand<T = object>({column}: TableHeaderCellExpandProps<T>)  {
	return (
		<Table.Th
				key={column.uid}
				colSpan={column.colspan}
				// rowSpan={column.isColumns ? 1 : rowspan - column.parentLevel}
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

export function TableHeaderCell<T = object>({ column, onToggle,	onSort,	onExpand }: TableHeaderCellProps<T>) {
	if (column.isGrouped) {
		return TableHeaderCellExpand<T>({ column });
	}
	return (
		<Table.Th
			key={column.uid}
			colSpan={column.colspan}
			// rowSpan={
			// 	column.isColumns ? 1 : rowspan - column.parentLevel
			// }
			style={column.style || {}}
			role="columnheader"
		>
			<Group justify='space-between'>
				{TableHeaderCellSlot<T>({column})}
				<Group flex='0' justify='flex-end' wrap="nowrap">
					{TableHeaderCellSort<T>({column, onClick: onSort})}
					{TableHeaderCellToggleable<T>({column, onClick: onToggle})}
				</Group>
			</Group>
		</Table.Th>
	);
}
import { Group } from '@mantine/core';
import { useTableDataContext } from '../../context';
import type { TableHeaderCellGroupProps } from '../type';
import { TableHeaderCellExpander } from './cell-expander';
import { TableHeaderCellSlot } from './cell-slot';
import { TableHeaderCellWrap } from './cell-wrap';

export function TableHeaderCellGroup<T = object>({
	column,
	maxRow,
	maxCol,
	...props
}: TableHeaderCellGroupProps<T>) {
	const { groupAt } = useTableDataContext<T>();
	return (
		<TableHeaderCellWrap<T> column={column} maxRow={maxRow} maxCol={maxCol}>
			<Group justify="space-between" align="center" wrap="nowrap" grow gap="xs">
				{groupAt === 'start' && (
					<Group gap={4} wrap="nowrap" flex="0">
						{column.isGrouped && (
							<TableHeaderCellExpander<T> kind="grouped" column={column} flex="0" {...props} />
						)}
						{column.isGroup && (
							<TableHeaderCellExpander<T> kind="group" column={column} flex="0" {...props} />
						)}
					</Group>
				)}
				{ column.isGrouped && <TableHeaderCellSlot<T> column={column} /> }
				{groupAt === 'end' && (
					<Group gap={4} wrap="nowrap" flex="0">
						{column.isGrouped && (
							<TableHeaderCellExpander<T> kind="grouped" column={column} flex="0" {...props} />
						)}
						{column.isGroup && (
							<TableHeaderCellExpander<T> kind="group" column={column} flex="0" {...props} />
						)}
					</Group>
				)}
			</Group>
		</TableHeaderCellWrap>
	);
}

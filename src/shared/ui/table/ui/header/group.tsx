import { Group } from '@mantine/core';
import { useTableDataContext } from '../../context';
import classes from '../style.module.css';
import type { TableHeaderCellGroupProps } from '../type';
import { TableHeaderCellExpander } from './cell-expander';
import { TableHeaderCellSlot } from './cell-slot';
import { TableHeaderCellWrap } from './cell-wrap';
import { TableHeaderCellUnifiedExpander } from './unified-expander';

export function TableHeaderCellGroup<T = object>({
	column,
	maxRow,
	maxCol,
	...props
}: TableHeaderCellGroupProps<T>) {
	const { groupAt } = useTableDataContext<T>();
	const isGroupOnly = column.isGroup && !column.isGrouped;
	const isUnified = column.isGroup && column.isGrouped;
	/** group-колонка: только кнопка, без текста заголовка */
	const showHeaderLabel = !!column.header && !isGroupOnly;
	const innerClass = showHeaderLabel
		? classes['expanderHeaderInnerLabeled']
		: classes['expanderHeaderInner'];

	const expanders = isUnified ? (
		<TableHeaderCellUnifiedExpander<T> column={column} flex="0" {...props} />
	) : (
		<>
			{column.isGrouped && (
				<TableHeaderCellExpander<T> kind="grouped" column={column} flex="0" {...props} />
			)}
			{column.isGroup && (
				<TableHeaderCellExpander<T> kind="group" column={column} flex="0" {...props} />
			)}
		</>
	);

	return (
		<TableHeaderCellWrap<T>
			column={column}
			maxRow={maxRow}
			maxCol={maxCol}
			className={isGroupOnly ? classes['expanderHeader'] : undefined}
		>
			<div className={innerClass}>
				{groupAt === 'start' && (
					<Group gap={4} wrap="nowrap" flex="0">
						{expanders}
					</Group>
				)}
				{showHeaderLabel && <TableHeaderCellSlot<T> column={column} />}
				{groupAt === 'end' && (
					<Group gap={4} wrap="nowrap" flex="0">
						{expanders}
					</Group>
				)}
			</div>
		</TableHeaderCellWrap>
	);
}

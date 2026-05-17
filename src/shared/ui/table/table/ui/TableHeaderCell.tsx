import { ActionIcon, Table } from '@mantine/core';
import { TbArrowDown, TbArrowsVertical, TbArrowUp } from 'react-icons/tb';



function TableHeaderCellSlot (column)  {
	return column.render?.({ column }) || column.header
}

function TableHeaderCellSort (column)  {
	if (!column.sortable) {
		return "";
	}
	return (
		<ActionIcon variant="subtle">
			<TbArrowsVertical />
			<TbArrowUp />
			<TbArrowDown />
		</ActionIcon>
	);
}

function TableHeaderCellExpand (column)  {
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
				{TableHeaderCellSlot(column)}
			</Table.Th>
	);
}

export function TableHeaderCell(column) {
	if (column.isGrouped) {
				return TableHeaderCellExpand(column);
			}
			return (
				<Table.Th
					key={column.uid}
					colSpan={column.colspan}
					// rowSpan={
					// 	column.isColumns ? 1 : rowspan - column.parentLevel
					// }
					style={column.style}
					role="columnheader"
				>
					{TableHeaderCellSlot(column)}
					{TableHeaderCellSort(column)}
				</Table.Th>
			);
}
import { Table } from "@mantine/core";
import { memo, useMemo } from 'react';
import { useTableDataContext, useTableGroupingContext } from '../../context';
import { getGroupedColumnForLevel } from '../../utils/group-by';
import classes from '../style.module.css';
import type { TableBodyRowProps } from '../type';
import { TableBodyCell } from "./cell";
import { TableBodyGroup } from "./group";
import { TableBodyGrouped } from "./grouped";

function resolveGroupedRowClass(
	groupedVisual: TableBodyRowProps['groupedVisual'],
): string | undefined {
	if (groupedVisual === 'highlight-last') {
		return classes['groupedBlockHighlighted'];
	}
	return undefined;
}

export const TableBodyRow = memo(function TableBodyRow<T = object>({
	node,
	columns,
	level = 0,
	group,
	grouped,
	groupedVisual,
}: TableBodyRowProps<T>) {
	const { rowActionsOnHover, hasActionsColumn } = useTableDataContext<T>();
	const { groupLayout, groupKeys } = useTableGroupingContext<T>();
	const showGrouped =
		groupLayout !== 'unified' &&
		groupLayout !== 'group-first' &&
		grouped &&
		node.isParent &&
		(node.nodes?.length ?? 0) > 0;
	const hoverSlotRow = rowActionsOnHover && !hasActionsColumn;
	const nestedLevel = level + 1;
	const expandGroupedColumn = useMemo(
		() => getGroupedColumnForLevel(columns, groupKeys, node.groupLevel ?? 0) ?? grouped,
		[columns, groupKeys, node.groupLevel, grouped],
	);
	const groupedRowClass = resolveGroupedRowClass(groupedVisual);
	const rowClassName = [hoverSlotRow ? classes['rowWithActions'] : undefined, groupedRowClass]
		.filter(Boolean)
		.join(' ') || undefined;

	return <>
		<Table.Tr className={rowClassName}>
			{columns.map((column, columnIndex) => {
				return (
					<TableBodyCell
						key={column.field as string}
						node={node}
						column={column}
						columns={columns}
						columnIndex={columnIndex}
					/>
				);
			})}
		</Table.Tr>
		{showGrouped && expandGroupedColumn && (
			<TableBodyGrouped node={node} columns={columns} column={expandGroupedColumn} level={nestedLevel} />
		)}
		{group && <TableBodyGroup node={node} columns={columns} column={group} level={nestedLevel} />}
	</>
}) as <T = object>(props: TableBodyRowProps<T>) => React.ReactNode;

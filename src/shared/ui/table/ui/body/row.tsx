import { Table } from "@mantine/core";
import { useTableDataContext } from '../../context';
import classes from '../style.module.css';
import type { TableBodyRowProps } from '../type';
import { TableBodyCell } from "./cell";
import { TableBodyGroup } from "./group";
import { TableBodyGrouped } from "./grouped";

export function TableBodyRow<T = object>({ node, columns, level = 0, group, grouped }: TableBodyRowProps<T>) {
	const { rowActionsOnHover, hasActionsColumn, groupLayout } = useTableDataContext<T>();
	const showGrouped =
		groupLayout !== 'unified' &&
		groupLayout !== 'group-first' &&
		grouped &&
		node.isParent &&
		(node.nodes?.length ?? 0) > 0;
	const hoverSlotRow = rowActionsOnHover && !hasActionsColumn;

	return <>
		<Table.Tr className={hoverSlotRow ? classes['rowWithActions'] : undefined}>
			{columns.map((column) => {
				return <TableBodyCell key={column.field as string} node={node} column={column} level={level} />
			})}
		</Table.Tr>
		{showGrouped && <TableBodyGrouped node={node} columns={columns} column={grouped} level={level + 1} />}
		{group && <TableBodyGroup node={node} columns={columns} column={group} level={level + 1} />}
	</>
}

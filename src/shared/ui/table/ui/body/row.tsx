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
	const nestedLevel = level + 1;

	return <>
		<Table.Tr className={hoverSlotRow ? classes['rowWithActions'] : undefined}>
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
		{showGrouped && (
			<TableBodyGrouped node={node} columns={columns} column={grouped} level={nestedLevel} />
		)}
		{group && <TableBodyGroup node={node} columns={columns} column={group} level={nestedLevel} />}
	</>
}

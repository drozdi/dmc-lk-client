import { useTableDataContext, useTableGroupingContext } from '../../context';
import classes from '../style.module.css';
import type { TableBodyCellProps } from '../type';
import { TableBodyCellActions } from './actions-cell';
import { TableBodyCellExpander } from './cell-expander';
import { TableBodyCellSlot } from './cell-slot';
import { TableBodyCellWrap } from './cell-wrap';
import { TableBodyCellExpand } from './expand';
import { TableBodyCellHoverSlot } from './hover-slot-cell';
import { TableBodyCellSelector } from './selector';
import { TableBodyUnifiedExpander } from './unified-expander';

function GroupedGroupCellContent<T>({
	node,
	column,
}: {
	node: TableBodyCellProps<T>['node'];
	column: TableBodyCellProps<T>['column'];
}) {
	const { updateNode, commitEdit, editorMode } = useTableDataContext<T>();
	const { groupAt } = useTableGroupingContext<T>();

	const slot =
		(editorMode(node, column) &&
			column.editor?.(
				node.data,
				column,
				(value) => updateNode(node.index, column.field as keyof T, value as T[keyof T]),
				() => commitEdit(node.index),
			)) || <TableBodyCellSlot<T> node={node} column={column} />;

	return (
		<div className={classes['expanderHeaderInnerLabeled']}>
			{groupAt === 'start' && <TableBodyUnifiedExpander<T> node={node} column={column} />}
			{slot}
			{groupAt === 'end' && <TableBodyUnifiedExpander<T> node={node} column={column} />}
		</div>
	);
}

export function TableBodyCell<T = object>({
	node,
	column,
	columns,
	columnIndex,
}: TableBodyCellProps<T>) {
	if (column.isSelecting) {
		return <TableBodyCellSelector<T> node={node} column={column} />;
	}
	if (column.isActions) {
		return <TableBodyCellActions<T> node={node} column={column} />;
	}
	if (column.isHoverSlot) {
		return <TableBodyCellHoverSlot<T> node={node} column={column} />;
	}
	if (column.isGroup && !column.isGrouped) {
		return (
			<TableBodyCellExpand<T>
				node={node}
				column={column}
				columns={columns}
				columnIndex={columnIndex}
			/>
		);
	}
	const { updateNode, commitEdit, editorMode } = useTableDataContext<T>();
	const { groupAt } = useTableGroupingContext<T>();

	if (column.isGroup && column.isGrouped) {
		return (
			<TableBodyCellWrap<T>
				column={column}
				columns={columns}
				columnIndex={columnIndex}
				node={node}
				plain
			>
				<GroupedGroupCellContent<T> node={node} column={column} />
			</TableBodyCellWrap>
		);
	}

	return (
		<TableBodyCellWrap<T> column={column} columns={columns} columnIndex={columnIndex} node={node}>
			{groupAt === 'start' && <TableBodyCellExpander<T> node={node} column={column} />}
			{(editorMode(node, column) &&
				column.editor?.(
					node.data,
					column,
					(value) => updateNode(node.index, column.field as keyof T, value as T[keyof T]),
					() => commitEdit(node.index),
				)) || <TableBodyCellSlot<T> node={node} column={column} />}
			{groupAt === 'end' && <TableBodyCellExpander<T> node={node} column={column} />}
		</TableBodyCellWrap>
	);
}
import { useTableDataContext } from '../../context';
import type { TableBodyCellProps } from '../type';
import { TableBodyCellExpander } from './cell-expander';
import { TableBodyCellSlot } from './cell-slot';
import { TableBodyCellWrap } from './cell-wrap';
import { TableBodyCellExpand } from './expand';
import { TableBodyCellSelector } from './selector';
import { TableBodyExpander } from './expander';
import { hasGroupNestedData } from '../../utils/group-by';

export function TableBodyCell<T = object>({ node, column, level = 0 }: TableBodyCellProps<T>) {
	if (column.isSelecting) {
		return <TableBodyCellSelector<T> node={node} column={column} />;
	}
	if (column.isGroup && !column.isGrouped) {
		return <TableBodyCellExpand<T> node={node} column={column} level={level} />;
	}
	const { updateNode, commitEdit, groupAt, editorMode } = useTableDataContext<T>();

	if (column.isGroup && column.isGrouped) {
		const hasNested = hasGroupNestedData(node, column);
		return (
			<TableBodyCellWrap<T> level={level} column={column} node={node}>
				{groupAt === 'start' && (
					<>
						<TableBodyCellExpander<T> node={node} column={column} />
						{hasNested && <TableBodyExpander<T> kind="group" node={node} column={column} />}
					</>
				)}
				{(editorMode(node, column) &&
					column.editor?.(
						node.data,
						column,
						(value) => updateNode(node.index, column.field as keyof T, value as T[keyof T]),
						() => commitEdit(node.index),
					)) || <TableBodyCellSlot<T> node={node} column={column} />}
				{groupAt === 'end' && (
					<>
						<TableBodyCellExpander<T> node={node} column={column} />
						{hasNested && <TableBodyExpander<T> kind="group" node={node} column={column} />}
					</>
				)}
			</TableBodyCellWrap>
		);
	}

	return (
		<TableBodyCellWrap<T> level={level} column={column} node={node}>
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
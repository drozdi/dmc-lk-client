import { useTableDataContext } from '../../context';
import { canExpandGroupedNode } from '../../utils/group-by';
import type { TableBodyCellExpanderProps } from '../type';
import { TableBodyExpander } from './expander';

export function TableBodyCellExpander<T = object>({ node, column }: TableBodyCellExpanderProps<T>) {
	const { groupKeys } = useTableDataContext<T>();

	if (!column.isGrouped || !canExpandGroupedNode(node, groupKeys)) {
		return null;
	}

	const level = node.groupLevel ?? 0;
	const activeKey = groupKeys[level];

	if (groupKeys.length > 1 && activeKey && column.field !== activeKey) {
		return null;
	}

	return <TableBodyExpander<T> kind="grouped" node={node} column={column} flex="0" />;
}

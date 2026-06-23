import type { TableBodyCellExpanderProps } from '../type';
import { TableBodyExpander } from './expander';

export function TableBodyCellExpander<T = object>({ node, column }: TableBodyCellExpanderProps<T>) {
	if (!column.isGrouped || !node.nodes?.length) {
		return null
	}
	return <TableBodyExpander<T> node={node} column={column} flex='0' />
}

import type { TableBodyCellExpandProps } from '../type';
import { TableBodyCellWrap } from './cell-wrap';
import { TableBodyExpander } from './expander';

export function TableBodyCellExpand<T = object>({ node, column, level = 0 }: TableBodyCellExpandProps<T>) {
	if (!node?.data?.[column.field as keyof T]) {
		return <TableBodyCellWrap<T> node={node} column={column} />;
	}
	return <TableBodyCellWrap<T> node={node} column={column} level={level}>
		<TableBodyExpander<T> node={node} column={column} />
	</TableBodyCellWrap>
}

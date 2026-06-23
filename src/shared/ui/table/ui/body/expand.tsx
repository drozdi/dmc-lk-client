import type { TableBodyCellExpandProps } from '../type';
import { hasGroupNestedData } from '../../utils/group-by';
import { TableBodyCellWrap } from './cell-wrap';
import { TableBodyExpander } from './expander';

export function TableBodyCellExpand<T = object>({ node, column, level = 0 }: TableBodyCellExpandProps<T>) {
	if (!hasGroupNestedData(node, column)) {
		return <TableBodyCellWrap<T> node={node} column={column} />;
	}
	return (
		<TableBodyCellWrap<T> node={node} column={column} level={level}>
			<TableBodyExpander<T> kind="group" node={node} column={column} />
		</TableBodyCellWrap>
	);
}

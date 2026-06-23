import type { TableHeaderCellGroupProps } from '../type';

import { TableHeaderCellExpander } from './cell-expander';
import { TableHeaderCellWrap } from './cell-wrap';

export function TableHeaderCellGroup<T = object>({
	column,
	maxRow,
	maxCol,
	...props
}: TableHeaderCellGroupProps<T>) {
	return (
		<TableHeaderCellWrap<T> column={column} maxRow={maxRow} maxCol={maxCol}>
			<TableHeaderCellExpander<T> column={column} {...props} />
		</TableHeaderCellWrap>
	);
}

import type { TableHeaderCellWrapProps } from '../type';
import { TableHeaderCellWrap } from './cell-wrap';
import classes from '../body/row-actions.module.css';

export function TableHeaderCellHoverSlot<T = object>({
	column,
	maxCol,
	maxRow,
}: TableHeaderCellWrapProps<T>) {
	return (
		<TableHeaderCellWrap<T>
			column={column}
			maxRow={maxRow}
			maxCol={maxCol}
			className={classes.hoverSlotHeader}
		/>
	);
}

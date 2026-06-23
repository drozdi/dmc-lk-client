import { Checkbox } from '@mantine/core';
import { useTableDataContext } from '../../context';
import type { TableHeaderCellWrapProps } from '../type';
import classes from '../body/selector.module.css';
import { TableHeaderBulkActions } from './bulk-actions';
import { TableHeaderCellWrap } from './cell-wrap';

export interface TableHeaderCellSelectorProps<T = object>
	extends TableHeaderCellWrapProps<T> {}

export function TableHeaderCellSelector<T = object>({
	column,
	maxRow,
	maxCol,
}: TableHeaderCellSelectorProps<T>) {
	const { allSelected, someSelected, selectAll } = useTableDataContext<T>();

	return (
		<TableHeaderCellWrap<T>
			column={column}
			maxRow={maxRow}
			maxCol={maxCol}
			className={classes.selectHeader}
		>
			<div className={classes.selectHeaderInner}>
				<Checkbox
					checked={allSelected}
					indeterminate={someSelected}
					onChange={(e) => selectAll(e.currentTarget.checked)}
				/>
				<div className={classes.selectBulkOverlay}>
					<TableHeaderBulkActions target="select" />
				</div>
			</div>
		</TableHeaderCellWrap>
	);
}

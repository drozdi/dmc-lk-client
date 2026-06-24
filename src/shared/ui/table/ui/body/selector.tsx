import { Checkbox } from '@mantine/core';
import { useTableDataContext } from '../../context';
import classes from '../style.module.css';
import type { TableBodyCellBaseProps } from '../type';
import { TableBodyCellWrap } from './cell-wrap';

export interface TableBodyCellSelectorProps<T = object> extends TableBodyCellBaseProps<T> {}

export function TableBodyCellSelector<T = object>({
	node,
	column,
}: TableBodyCellSelectorProps<T>) {
	const { isRowSelected, toggleRow } = useTableDataContext<T>();

	return (
		<TableBodyCellWrap<T> node={node} column={column} className={classes.selectCell}>
			<div className={classes.selectHeaderInner}>
				<Checkbox
					checked={isRowSelected(node.index)}
					onChange={() => toggleRow(node.index)}
				/>
			</div>
		</TableBodyCellWrap>
	);
}

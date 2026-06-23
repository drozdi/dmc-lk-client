import { Checkbox } from '@mantine/core';
import { useTableDataContext } from '../../context';
import type { TableBodyCellBaseProps } from '../type';
import { TableBodyCellWrap } from './cell-wrap';

export interface TableBodyCellSelectorProps<T = object> extends TableBodyCellBaseProps<T> {}

export function TableBodyCellSelector<T = object>({
	node,
	column,
}: TableBodyCellSelectorProps<T>) {
	const { selectedRows, toggleRow, selectAll, isRowSelected, someSelected, allSelected } =
		useTableDataContext<T>();

	return (
		<TableBodyCellWrap<T> node={node} column={column}>
			<Checkbox
				checked={isRowSelected(node.index)}
				onChange={() => toggleRow(node.index)}
			/>
		</TableBodyCellWrap>
	);
}

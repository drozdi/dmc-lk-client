import { Checkbox, Group } from '@mantine/core';
import { useTableDataContext } from '../../context';
import type { TableHeaderCellWrapProps } from '../type';
import { TableHeaderCellWrap } from './cell-wrap';

export interface TableHeaderCellSelectorProps<T = object>
	extends TableHeaderCellWrapProps<T> {}

export function TableHeaderCellSelector<T = object>({
	column,
	maxRow,
	maxCol,
	...props
}: TableHeaderCellSelectorProps<T>) {
	const { allSelected, someSelected, selectAll } = useTableDataContext<T>();
	return (
		<TableHeaderCellWrap<T> column={column} maxRow={maxRow} maxCol={maxCol}>
			<Group grow ta="center" justify="center">
				<Checkbox
					checked={allSelected}
					indeterminate={someSelected}
					onChange={(e) => selectAll(e.currentTarget.checked)}
				/>
			</Group>
		</TableHeaderCellWrap>
	);
}

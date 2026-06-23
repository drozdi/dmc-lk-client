import { Group, Table } from "@mantine/core";
import { useMemo } from 'react';
import { useTableDataContext } from '../../context';
import type { TableNode } from '../../type';
import { getGroupedColumnLevel, getGroupedColumnPadding } from '../../utils/group-by';
import type { TableBodyCellWrapProps } from '../type';

export function TableBodyCellWrap<T = object>({
	node,
	column,
	onClick,
	children,
	level = 0,
}: TableBodyCellWrapProps<T>) {
	const { groupKeys } = useTableDataContext<T>();

	const style = useMemo(() => {
		const baseStyle =
			typeof column.bodyStyle === 'function'
				? column.bodyStyle?.(column, node as TableNode<T>)
				: column.bodyStyle || {};

		const groupedLevel = getGroupedColumnLevel(column, groupKeys);
		const paddingLeft = getGroupedColumnPadding<T>(column, level);
		return {
			...baseStyle,
			...(paddingLeft ? { paddingLeft } : {}),
		};
	}, [column, groupKeys, node]);

	return (
		<Table.Td onClick={onClick} style={style}>
			{children ? (
				<Group justify="flex-start" align="center" grow>
					{children}
				</Group>
			) : null}
		</Table.Td>
	);
}

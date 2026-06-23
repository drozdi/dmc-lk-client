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
	className,
}: TableBodyCellWrapProps<T>) {
	const { groupKeys } = useTableDataContext<T>();

	const style = useMemo(() => {
		const baseStyle =
			typeof column.bodyStyle === 'function'
				? column.bodyStyle?.(column, node as TableNode<T>)
				: column.bodyStyle || {};

		const groupedLevel = level || getGroupedColumnLevel(column, groupKeys);
		const paddingLeft = getGroupedColumnPadding<T>(column, groupedLevel);
		return {
			...baseStyle,
			...(paddingLeft ? { paddingLeft } : {}),
		};
	}, [column, groupKeys, node, level]);

	return (
		<Table.Td
			className={className}
			onClick={onClick}
			style={style}
			w={column.isHoverSlot ? 0 : column.isSelecting ? 44 : undefined}
			align={column.isSelecting ? 'center' : column.align}
		>
			{children ? (
				column.isHoverSlot ? (
					children
				) : column.isSelecting ? (
					children
				) : (
					<Group justify="flex-start" align="center" grow>
						{children}
					</Group>
				)
			) : null}
		</Table.Td>
	);
}

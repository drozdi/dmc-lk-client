import { Group, Table } from "@mantine/core";
import { useMemo } from 'react';
import { useTableDataContext } from '../../context';
import type { TableNode } from '../../type';
import {
	appliesGroupedCellPadding,
	getGroupedCellPaddingForRow,
	getGroupedColumnLevel,
	getGroupedColumnPadding,
	resolveRowGroupLevel,
} from '../../utils/group-by';
import type { TableBodyCellWrapProps } from '../type';

export function TableBodyCellWrap<T = object>({
	node,
	column,
	columns,
	columnIndex,
	onClick,
	children,
	className,
	plain = false,
}: TableBodyCellWrapProps<T>) {
	const { groupKeys, groupLevel: tableNestLevel, groupLayout } = useTableDataContext<T>();

	const style = useMemo(() => {
		const baseStyle =
			typeof column.bodyStyle === 'function'
				? column.bodyStyle?.(column, node as TableNode<T>)
				: column.bodyStyle || {};

		let paddingLeft: string | undefined;
		if (appliesGroupedCellPadding(groupLayout, tableNestLevel)) {
			const rowGroupLevel = resolveRowGroupLevel(node, groupKeys, columns ?? [], tableNestLevel);
			paddingLeft =
				columns !== undefined && columnIndex !== undefined && rowGroupLevel >= 0
					? getGroupedCellPaddingForRow(
							node,
							column,
							columnIndex,
							columns,
							groupKeys,
							rowGroupLevel,
							tableNestLevel,
						)
					: getGroupedColumnPadding<T>(column, getGroupedColumnLevel(column, groupKeys));
		}

		return {
			...baseStyle,
			...(paddingLeft ? { paddingLeft } : {}),
		};
	}, [column, columns, columnIndex, groupKeys, groupLayout, node, tableNestLevel]);

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
				) : plain ? (
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

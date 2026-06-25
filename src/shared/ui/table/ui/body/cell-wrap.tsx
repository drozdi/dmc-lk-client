import { Group, Table } from "@mantine/core";
import { memo, useMemo } from 'react';
import { useTableGroupingContext } from '../../context';
import type { TableNode } from '../../type';
import {
	appliesGroupedCellPadding,
	getGroupedCellPaddingForRow,
	getGroupedColumnLevel,
	getGroupedColumnPadding,
	isUnifiedGroupColumn,
	resolveRowGroupLevel,
	toGroupedPaddingStyle,
} from '../../utils/group-by';
import type { TableBodyCellWrapProps } from '../type';

export const TableBodyCellWrap = memo(function TableBodyCellWrap<T = object>({
	node,
	column,
	columns,
	columnIndex,
	onClick,
	children,
	className,
	plain = false,
}: TableBodyCellWrapProps<T>) {
	const { groupKeys, groupLevel: tableNestLevel, groupLayout, groupAt } = useTableGroupingContext<T>();

	const { tdStyle, groupedContentStyle } = useMemo(() => {
		const baseStyle =
			typeof column.bodyStyle === 'function'
				? column.bodyStyle?.(column, node as TableNode<T>)
				: column.bodyStyle || {};

		let groupedPadding: string | undefined;
		if (appliesGroupedCellPadding(groupLayout, tableNestLevel)) {
			const rowGroupLevel = resolveRowGroupLevel(node, groupKeys, columns ?? [], tableNestLevel);
			groupedPadding =
				columns !== undefined && columnIndex !== undefined && rowGroupLevel >= 0
					? getGroupedCellPaddingForRow(
							node,
							column,
							columnIndex,
							columns,
							groupKeys,
							rowGroupLevel,
							tableNestLevel,
							groupAt,
						)
					: isUnifiedGroupColumn(column)
						? undefined
						: getGroupedColumnPadding<T>(column, getGroupedColumnLevel(column, groupKeys));
		}

		return {
			tdStyle: baseStyle,
			groupedContentStyle: toGroupedPaddingStyle(groupedPadding),
		};
	}, [column, columns, columnIndex, groupAt, groupKeys, groupLayout, node, tableNestLevel]);

	const hasGroupedContentStyle = Object.keys(groupedContentStyle).length > 0;

	const content = useMemo(() => {
		if (!children) {
			return null;
		}
		if (column.isHoverSlot || column.isSelecting) {
			return children;
		}
		if (plain) {
			if (!hasGroupedContentStyle) {
				return children;
			}
			return (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						width: '100%',
						...groupedContentStyle,
					}}
				>
					{children}
				</div>
			);
		}
		return (
			<Group
				justify="flex-start"
				align="center"
				grow
				style={hasGroupedContentStyle ? { width: '100%', ...groupedContentStyle } : undefined}
			>
				{children}
			</Group>
		);
	}, [children, column.isHoverSlot, column.isSelecting, groupedContentStyle, hasGroupedContentStyle, plain]);

	return (
		<Table.Td
			className={className}
			onClick={onClick}
			style={tdStyle}
			w={column.isHoverSlot ? 0 : column.isSelecting ? 44 : undefined}
			align={column.isSelecting ? 'center' : column.align}
		>
			{content}
		</Table.Td>
	);
}) as <T = object>(props: TableBodyCellWrapProps<T>) => React.ReactNode;

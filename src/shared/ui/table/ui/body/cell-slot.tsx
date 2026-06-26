import { Box } from '@mantine/core';
import { useTableDataContext, useTableExpandContext, useTableGroupingContext } from '../../context';
import {
	getNodeExpandKey,
	isGroupContainerRow,
	isGroupedExpanderCell,
	isUnifiedGroupColumn,
} from '../../utils/group-by';
import type { TableBodyCellSlotProps } from '../type';

export function TableBodyCellSlot<T = object>({
	node,
	column,
}: TableBodyCellSlotProps<T>) {
	const { handleModeChange, editMode } = useTableDataContext<T>();
	const { groupKeys, groupColumn } = useTableGroupingContext<T>();
	const { isExpanded } = useTableExpandContext();

	const isGroupContainer = isGroupContainerRow(node, groupColumn);
	const isUnified = isUnifiedGroupColumn(column);

	if (column.isGroup && !column.isGrouped) {
		return null;
	}

	const isGroupedExpander =
		!isUnified &&
		isGroupedExpanderCell(node, column, groupKeys) &&
		isExpanded(getNodeExpandKey(node), 'grouped');

	const attrs: {
		onDoubleClick?: () => void;
		onClick?: () => void;
		style?: React.CSSProperties;
	} = {};
	if (!isGroupContainer && !isUnified && editMode) {
		if (editMode === 'row') {
			attrs.onDoubleClick = () => handleModeChange(node, column);
		} else if (editMode === 'cell') {
			attrs.onClick = () => handleModeChange(node, column);
			attrs.style = {
				cursor: 'pointer',
			};
		}
	}

	if (isGroupedExpander) {
		attrs.style = {
			...attrs.style,
			fontWeight: 700,
		};
	}

	const cellValue = (() => {
		if (typeof column.body === 'function') {
			try {
				return column.body(node.data, column);
			} catch {
				return null;
			}
		}

		if (column.field) {
			return node.data[column.field as keyof T];
		}

		return null;
	})();

	return (
		<Box flex="1" maw="100%" ta={column.align} {...attrs}>
			{cellValue != null ? cellValue : null}
		</Box>
	);
}

import { Box } from '@mantine/core';
import { useTableDataContext } from '../../context';
import type { TableBodyCellSlotProps } from '../type';

export function TableBodyCellSlot<T = object>({
	node,
	column,
}: TableBodyCellSlotProps<T>) {
	const { handleModeChange, editMode } = useTableDataContext<T>();

	if (column.isGroup && !column.isGrouped) {
		return null;
	}

	const attrs: {
		onDoubleClick?: () => void;
		onClick?: () => void;
		style?: React.CSSProperties;
	} = {};
	if (editMode === 'row') {
		attrs.onDoubleClick = () => handleModeChange(node, column);
	} else if (editMode === 'cell') {
		attrs.onClick = () => handleModeChange(node, column);
		attrs.style = {
			cursor: 'pointer',
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

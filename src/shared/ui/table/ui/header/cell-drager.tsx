import { ActionIcon } from '@mantine/core';
import {
	TbGripVertical
} from 'react-icons/tb';
import { isColumnGroupHeader, isColumnOrderReorderable } from '../../utils/column-fields';
import type { TableHeaderCellDragerProps } from '../type';

export function TableHeaderCellDrager<T = object>({
	column,
	...props
}: TableHeaderCellDragerProps<T>) {
	const canDragField = column.isDraggable && isColumnOrderReorderable(column);
	const canDragGroup = column.isDraggable && isColumnGroupHeader(column);
	if (!canDragField && !canDragGroup) {
		return null;
	}
	return (
		<ActionIcon
			flex="0"
			role="img"
			variant="subtle"
			aria-label="Перетаскивание"
			title="Перетаскивание"
			{...props}
			style={{
				...props.style,
				cursor: 'move',
			}}
		>
			<TbGripVertical />
		</ActionIcon>
	);
}
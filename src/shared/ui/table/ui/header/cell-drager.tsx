import { ActionIcon } from '@mantine/core';
import {
	TbGripVertical
} from 'react-icons/tb';
import type { TableHeaderCellDragerProps } from '../type';

export function TableHeaderCellDrager<T = object>({
	column,
	...props
}: TableHeaderCellDragerProps<T>) {
	if (!column.isDraggable || column.isGrouped || column.isGroup) {
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
import { ActionIcon } from '@mantine/core';
import { TbCircleChevronLeft, TbCircleChevronRight } from 'react-icons/tb';
import { useTableDataContext } from '../../context/TableDataContext';
import { useTableExpandContext } from '../../context/TableExpandContext';
import type { TableHeaderCellExpanderProps } from '../type';

/** Один expander в заголовке unified-колонки (group + grouped): только kind group. */
export function TableHeaderCellUnifiedExpander<T = object>({
	column,
	...props
}: TableHeaderCellExpanderProps<T>) {
	const { groupAt, groupKeys } = useTableDataContext<T>();
	const { expands, toggleExpand, expandables } = useTableExpandContext();

	if (!column.isGroup || !column.isGrouped) {
		return null;
	}

	if (groupKeys.indexOf(column.field as keyof T) === -1) {
		return null;
	}

	const levelKeys = expandables.group;
	if (!levelKeys.length) {
		return null;
	}

	const expandedAtLevel = expands.group.filter((key) => levelKeys.includes(key));
	const isExpand = expandedAtLevel.length === levelKeys.length;
	const ariaLabel = isExpand ? 'Свернуть все списки' : 'Развернуть все списки';

	return (
		<ActionIcon
			variant="subtle"
			title={ariaLabel}
			aria-label={ariaLabel}
			{...props}
			style={{
				...props.style,
				transition: 'rotate 0.3s ease',
				rotate: isExpand ? (groupAt === 'end' ? '-90deg' : '90deg') : undefined,
			}}
			onClick={() => {
				if (isExpand) {
					toggleExpand(levelKeys, 'group', { remove: true });
				} else {
					toggleExpand(levelKeys, 'group', { merge: true });
				}
			}}
		>
			{groupAt === 'end' ? <TbCircleChevronLeft /> : <TbCircleChevronRight />}
		</ActionIcon>
	);
}

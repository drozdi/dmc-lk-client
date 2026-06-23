import { ActionIcon } from '@mantine/core';
import {
	TbCircleChevronLeft,
	TbCircleChevronRight
} from 'react-icons/tb';
import { useTableDataContext } from '../../context/TableDataContext';
import type { TableHeaderCellExpanderProps } from '../type';

export function TableHeaderCellExpander<T = object>({
	column,
	...props
}: TableHeaderCellExpanderProps<T>) {
	const { expands, toggleExpand, groupAt, expandables } = useTableDataContext<T>();
	const isExpandable = Array.isArray(expandables) && expandables.length > 0;
	if (!isExpandable) {
		return null;
	}
	
	const isExpand = isExpandable && expands.length === expandables.length;
	const ariaLabel = isExpand ? 'Свернуть все группы' : 'Развернуть все группы';
	const rotateAngle = isExpand ? groupAt === 'end' ? '-90deg' : '90deg' : undefined;

	return (
		<ActionIcon
			variant="subtle"
			title={ariaLabel}
			aria-label={ariaLabel}
			{...props}
			style={{
				...props.style,
				transition: 'rotate 0.3s ease',
				rotate: rotateAngle,
			}}
			onClick={() => {
				if (!isExpandable) {
					return;
				}
				if (isExpand) {
					toggleExpand([]);
				} else {
					toggleExpand(expandables);
				}
			}}
		>
			{groupAt === 'end' ? <TbCircleChevronLeft /> : <TbCircleChevronRight />}
		</ActionIcon>
	);
}
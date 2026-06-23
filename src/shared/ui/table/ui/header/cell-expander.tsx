import { ActionIcon } from '@mantine/core';
import {
	TbCircleChevronLeft,
	TbCircleChevronRight
} from 'react-icons/tb';
import { useTableDataContext } from '../../context/TableDataContext';
import type { ExpandKind } from '../../type';
import type { TableHeaderCellExpanderProps } from '../type';

function resolveExpandKind<T>(column: TableHeaderCellExpanderProps<T>['column']): ExpandKind {
	return column.isGroup ? 'group' : 'grouped';
}

export function TableHeaderCellExpander<T = object>({
	column,
	...props
}: TableHeaderCellExpanderProps<T>) {
	const { expands, toggleExpand, groupAt, expandables } = useTableDataContext<T>();
	const kind = resolveExpandKind(column);
	const kindExpandables = expandables[kind];
	const kindExpands = expands[kind];

	const isExpandable = kindExpandables.length > 0;
	if (!isExpandable) {
		return null;
	}

	const isExpand = kindExpands.length === kindExpandables.length;
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
				toggleExpand(isExpand ? [] : kindExpandables, kind);
			}}
		>
			{groupAt === 'end' ? <TbCircleChevronLeft /> : <TbCircleChevronRight />}
		</ActionIcon>
	);
}

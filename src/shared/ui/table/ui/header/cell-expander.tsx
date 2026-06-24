import { ActionIcon } from '@mantine/core';
import {
	TbCircleChevronLeft,
	TbCircleChevronRight
} from 'react-icons/tb';
import { useTableDataContext } from '../../context/TableDataContext';
import type { ExpandKind } from '../../type';
import type { TableHeaderCellExpanderProps } from '../type';

function resolveExpandKind<T>(column: TableHeaderCellExpanderProps<T>['column']): ExpandKind {
	if (column.isGroup && !column.isGrouped) {
		return 'group';
	}
	return 'grouped';
}

export function TableHeaderCellExpander<T = object>({
	column,
	kind: kindProp,
	...props
}: TableHeaderCellExpanderProps<T>) {
	const { expands, toggleExpand, groupAt, expandables, groupKeys, groupColumnField } =
		useTableDataContext<T>();
	const kind = kindProp ?? resolveExpandKind(column);

	if (kind === 'grouped') {
		if (!column.isGrouped || column.isGroup) {
			return null;
		}
		const columnLevel = groupKeys.indexOf(column.field as keyof T);
		if (columnLevel === -1) {
			return null;
		}
	} else {
		if (!column.isGroup || column.isGrouped) {
			return null;
		}
		if (groupColumnField && column.field !== groupColumnField) {
			return null;
		}
	}

	const columnLevel =
		kind === 'grouped' ? groupKeys.indexOf(column.field as keyof T) : -1;

	const levelKeys =
		kind === 'grouped'
			? (expandables.groupedByLevel[columnLevel] ?? [])
			: expandables.group;

	const isExpandable = levelKeys.length > 0;
	if (!isExpandable) {
		return null;
	}

	const expandedAtLevel = expands[kind].filter((key) => levelKeys.includes(key));
	const isExpand = expandedAtLevel.length === levelKeys.length;
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
				if (isExpand) {
					toggleExpand(levelKeys, kind, { remove: true });
				} else {
					toggleExpand(levelKeys, kind, { merge: true });
				}
			}}
		>
			{groupAt === 'end' ? <TbCircleChevronLeft /> : <TbCircleChevronRight />}
		</ActionIcon>
	);
}

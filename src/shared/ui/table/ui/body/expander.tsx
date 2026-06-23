import { ActionIcon, Box } from "@mantine/core";
import { TbCircleChevronLeft, TbCircleChevronRight } from 'react-icons/tb';
import { useTableDataContext } from '../../context';
import type { ExpandKind } from '../../type';
import type { TableBodyExpanderProps } from '../type';

function resolveExpandKind<T>(column: TableBodyExpanderProps<T>['column']): ExpandKind {
	if (column.isGroup) {
		return 'group';
	}
	return 'grouped';
}

export function TableBodyExpander<T = object>({ node, column, onClick, ...props }: TableBodyExpanderProps<T>) {
	if (!column.isGroup && !column.isGrouped) {
		return null;
	}

	const { isExpanded, toggleExpand, groupAt } = useTableDataContext<T>();
	const kind = resolveExpandKind(column);
	const isExpand = isExpanded(node.index, kind);

	const ariaLabel = isExpand ? 'Свернуть группу' : 'Развернуть группу';

	return (
		<Box ta="center">
			<ActionIcon
				variant="subtle"
				role="button"
				title={ariaLabel}
				aria-label={ariaLabel}
				{...props}
				style={{
					...props.style,
					transition: 'rotate 0.3s ease',
					rotate:
						isExpand && groupAt === 'end' ? '-90deg' : isExpand ? '90deg' : undefined,
				}}
				onClick={() => {
					if (onClick) {
						onClick(node.index);
						return;
					}
					toggleExpand(node.index, kind);
				}}
			>
				{groupAt === 'end' ? <TbCircleChevronLeft /> : <TbCircleChevronRight />}
			</ActionIcon>
		</Box>
	);
}

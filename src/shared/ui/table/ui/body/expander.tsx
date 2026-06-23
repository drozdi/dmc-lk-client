import { ActionIcon, Box } from "@mantine/core";
import { TbCircleChevronLeft, TbCircleChevronRight } from 'react-icons/tb';
import { useTableDataContext } from '../../context';
import type { TableBodyExpanderProps } from '../type';

export function TableBodyExpander<T = object>({ node, column, onClick, ...props }: TableBodyExpanderProps<T>) {
	if (!column.isGroup && !column.isGrouped) {
		return null;
	}

	const { expands, toggleExpand, groupAt } = useTableDataContext<T>();
	const isExpand = expands.includes(node.index);

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
				onClick={() => (onClick || toggleExpand)(node.index)}
			>
				{groupAt === 'end' ? <TbCircleChevronLeft /> : <TbCircleChevronRight />}
			</ActionIcon>
		</Box>
	);
}
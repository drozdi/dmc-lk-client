import { Group, Table } from "@mantine/core";
import { useMemo } from 'react';
import type { TableNode } from '../../type';
import type { TableBodyCellWrapProps } from '../type';

export function TableBodyCellWrap<T = object>({ node, column, level = 0, onClick, children }: TableBodyCellWrapProps<T>) {
	const style = useMemo(() => {
		const baseStyle =
			typeof column.bodyStyle === 'function'
				? column.bodyStyle?.(column, node as TableNode<T>)
				: column.bodyStyle || {};
		return {
			...baseStyle,
		};
	}, [column.bodyStyle, column, node]);
	
	return (
		<Table.Td
			onClick={onClick}
			style={{
				...style,
				paddingLeft:
					column.isGrouped || column.isGroup
						? `calc(calc(var(--mantine-spacing-base, 0.25rem) * var(--mantine-scale)) * 9 * ${level} + var(--table-horizontal-spacing, 0.5rem))`
						: '',
			}}
		>
			{children ? (
				<Group justify="flex-start" align="center" grow>
					{children}
				</Group>
			) : null}
		</Table.Td>
	);
}
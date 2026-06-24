import { Collapse, Table } from '@mantine/core';
import { useMemo } from 'react';
import { useTableDataContext, useTableExpandContext } from '../../context';
import {
	getGroupNestedColumns,
	getGroupNestedData,
	getNestedExpandLayout,
	getNestedTableColumns,
	getNodeExpandKey,
	hasGroupNestedData,
} from '../../utils/group-by';
import { TableData } from '../../TableData';
import type { TableDataProps, TableGroupLayout } from '../../type';
import type { TableBodyGroupProps } from '../type';

function resolveNestedGroupLayout(groupKeysLength: number): TableGroupLayout {
	if (groupKeysLength > 1) {
		return 'grouped-first';
	}
	return 'default';
}

export function TableBodyGroup<T = object>({ node, columns, column, level = 0 }: TableBodyGroupProps<T>) {
	const { props, colspan, groupAt, groupLayout, groupKeys } = useTableDataContext<T>();
	const { isExpanded } = useTableExpandContext();
	const isGroupFirst = groupLayout === 'group-first';

	const nestedColumns = useMemo(
		() => (isGroupFirst ? getGroupNestedColumns(columns) : getNestedTableColumns(columns)),
		[columns, isGroupFirst],
	);

	const nestedGroupKeys = useMemo(
		() => (isGroupFirst ? groupKeys : []),
		[isGroupFirst, groupKeys],
	);

	const nestedGroupLayout = useMemo(
		() => (isGroupFirst ? resolveNestedGroupLayout(groupKeys.length) : 'default'),
		[isGroupFirst, groupKeys.length],
	);

	const layout = useMemo(() => {
		const isGroupOnly = column.isGroup && !column.isGrouped;
		if (isGroupOnly) {
			if (groupAt === 'end') {
				return {
					padStart: 0,
					padEnd: columns.length - colspan,
					nestedColspan: colspan,
				};
			}
			return {
				padStart: columns.length - colspan,
				padEnd: 0,
				nestedColspan: colspan,
			};
		}
		return getNestedExpandLayout(columns, column, groupAt);
	}, [columns, column, groupAt, colspan]);

	if (!column.isGroup || !hasGroupNestedData(node, column)) {
		return null;
	}

	const isExpand = isExpanded(getNodeExpandKey(node), 'group');
	const nestedData = getGroupNestedData(node, column);
	const isRendered = !!column.body;

	const Tag = (column.body || TableData<T>) as React.FC<TableDataProps<T>>;

	return (
		<Table.Tr
			style={{
				borderBottomWidth: isExpand ? '2px' : '',
			}}
		>
			{!isRendered && groupAt === 'start' && layout.padStart > 0 && (
				<Table.Td colSpan={layout.padStart} p="0" aria-hidden />
			)}
			<Table.Td p="0" colSpan={isRendered ? columns.length : layout.nestedColspan}>
				<Collapse expanded={isExpand} p={isRendered ? 'xs' : '0'}>
					<Tag
						{...props}
						data={nestedData}
						columns={nestedColumns}
						groupKeys={nestedGroupKeys}
						groupAt={groupAt}
						groupLayout={nestedGroupLayout}
						level={level}
						withHeader={false}
						withPagination={false}
					/>
				</Collapse>
			</Table.Td>
			{!isRendered && groupAt === 'end' && layout.padEnd > 0 && (
				<Table.Td colSpan={layout.padEnd} p="0" />
			)}
		</Table.Tr>
	);
}

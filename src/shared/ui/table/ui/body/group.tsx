import { Collapse, Table } from '@mantine/core';
import { useMemo } from 'react';
import { useTableDataContext } from '../../context';
import {
	getGroupNestedData,
	getNestedTableColumns,
	getNodeExpandKey,
	hasGroupNestedData,
} from '../../utils/group-by';
import { TableData } from '../../TableData';
import type { TableDataProps } from '../../type';
import type { TableBodyGroupProps } from '../type';

export function TableBodyGroup<T = object>({ node, columns, column, level = 0 }: TableBodyGroupProps<T>) {
	const { props, isExpanded, colspan, groupAt } = useTableDataContext<T>();
	const nestedColumns = useMemo(() => getNestedTableColumns(columns), [columns]);

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
			{!isRendered && groupAt === 'start' && (
				<Table.Td colSpan={columns.length - colspan} p="0" />
			)}
			<Table.Td p="0" colSpan={isRendered ? columns.length : colspan}>
				<Collapse expanded={isExpand} p={isRendered ? 'xs' : '0'}>
					<Tag
						data={nestedData}
						columns={nestedColumns}
						groupKeys={[]}
						level={level}
						withHeader={false}
						withPagination={false}
						{...props}
					/>
				</Collapse>
			</Table.Td>
			{!isRendered && groupAt === 'end' && (
				<Table.Td colSpan={columns.length - colspan} p="0" />
			)}
		</Table.Tr>
	);
}

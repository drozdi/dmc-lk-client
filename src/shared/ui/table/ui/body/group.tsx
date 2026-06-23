import { Collapse, Table } from '@mantine/core';
import { useTableDataContext } from '../../context';
import { getGroupNestedData, getNodeExpandKey, hasGroupNestedData } from '../../utils/group-by';
import { TableData } from "../../TableData";
import type { TableDataProps } from "../../type";
import type { TableBodyGroupProps } from '../type';

export function TableBodyGroup<T = object>({ node, columns, column, level = 0 }: TableBodyGroupProps<T>) {
	if (!column.isGroup || !hasGroupNestedData(node, column)) {
		return null;
	}
	const { props, isExpanded, colspan, groupAt, columnWidths, resizeColumn, columnOrder, onColumnOrder } =
		useTableDataContext<T>();

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
				<Table.Td colSpan={columns.length - colspan} p="0"></Table.Td>
			)}
			<Table.Td p="0" colSpan={isRendered ? columns.length : colspan}>
				<Collapse expanded={isExpand} p={isRendered ? 'xs' : '0'}>
					<Tag
						data={nestedData}
						columns={columns.filter((column) => !column.isGroup)}
						columnWidths={columnWidths}
						onColumnResize={resizeColumn}
						columnOrder={columnOrder}
						onColumnOrder={onColumnOrder}
						level={level}
						withHeader={isRendered}
						withPagination={false}
						{...props}
					/>
				</Collapse>
			</Table.Td>
			{!isRendered && groupAt === 'end' && (
				<Table.Td colSpan={columns.length - colspan} p="0"></Table.Td>
			)}
		</Table.Tr>
	);
}
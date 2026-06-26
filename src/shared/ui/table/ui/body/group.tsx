import { Collapse, Table } from '@mantine/core';
import { useMemo } from 'react';
import { useTableDataContext, useTableExpandContext, useTableGroupingContext } from '../../context';
import {
	getGroupNestedColumns,
	getGroupNestedData,
	getGroupOnlyNestedRowLayout,
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

function GroupNestedRowCells({
	beforeExpander,
	afterExpander,
	nestedColspan,
	nestedBeforeExpander,
	groupAt,
	children,
}: {
	beforeExpander: number;
	afterExpander: number;
	nestedColspan: number;
	nestedBeforeExpander: boolean;
	groupAt: 'start' | 'end';
	children: React.ReactNode;
}) {
	const isStart = groupAt !== 'end';
	const leadingCells = Array.from({ length: beforeExpander }, (_, index) => (
		<Table.Td key={`leading-${index}`} p="0" aria-hidden />
	));
	const trailingCells = Array.from({ length: afterExpander }, (_, index) => (
		<Table.Td key={`trailing-${index}`} p="0" aria-hidden />
	));
	const expanderCell = <Table.Td key="expander" p="0" aria-hidden />;
	const nestedCell = (
		<Table.Td key="nested" p="0" colSpan={Math.max(nestedColspan, 1)}>
			{children}
		</Table.Td>
	);

	if (isStart) {
		if (nestedBeforeExpander) {
			return (
				<>
					{nestedCell}
					{expanderCell}
				</>
			);
		}
		return (
			<>
				{leadingCells}
				{expanderCell}
				{nestedCell}
			</>
		);
	}

	if (nestedBeforeExpander) {
		return (
			<>
				{nestedCell}
				{expanderCell}
				{trailingCells}
			</>
		);
	}

	return (
		<>
			{leadingCells}
			{expanderCell}
			{nestedCell}
		</>
	);
}

export function TableBodyGroup<T = object>({ node, columns, column, level = 0 }: TableBodyGroupProps<T>) {
	const { props, editMode } = useTableDataContext<T>();
	const { groupAt, groupLayout, groupKeys } = useTableGroupingContext<T>();
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

	const layout = useMemo(
		() => getGroupOnlyNestedRowLayout(columns, column, groupAt),
		[columns, column, groupAt],
	);

	if (!column.isGroup || !hasGroupNestedData(node, column)) {
		return null;
	}

	const isExpand = isExpanded(getNodeExpandKey(node), 'group');
	const nestedData = getGroupNestedData(node, column);
	const isRendered = !!column.body;

	const Tag = (column.body || TableData<T>) as React.FC<TableDataProps<T>>;

	const nestedTable = (
		<Collapse expanded={isExpand} p={isRendered ? 'xs' : '0'}>
			<Tag
				{...props}
				data={nestedData}
				columns={nestedColumns}
				groupKeys={nestedGroupKeys}
				groupAt={groupAt}
				groupLayout={nestedGroupLayout}
				level={level}
				editMode={editMode}
				withHeader={false}
				withPagination={false}
			/>
		</Collapse>
	);

	return (
		<Table.Tr
			style={{
				borderBottomWidth: isExpand ? '2px' : '',
			}}
		>
			{isRendered ? (
				<Table.Td p="0" colSpan={columns.length}>
					{nestedTable}
				</Table.Td>
			) : (
				<GroupNestedRowCells groupAt={groupAt ?? 'start'} {...layout}>
					{nestedTable}
				</GroupNestedRowCells>
			)}
		</Table.Tr>
	);
}

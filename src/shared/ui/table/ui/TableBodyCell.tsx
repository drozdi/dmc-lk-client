import { ActionIcon, Box, Group, Table, type ActionIconProps } from "@mantine/core";
import { TbCircleChevronLeft, TbCircleChevronRight } from 'react-icons/tb';
import { Text } from "../../text";
import { useTableDataContext } from '../context';
import { type ColumnEntity } from "../DataColumn";
import { type TableNode } from '../TableData';

export interface TableBodyCellBaseProps<T = object> {
	node: TableNode<T>;
	column: ColumnEntity<T>;
}


export interface TableBodyExpanderProps<T = object> extends TableBodyCellBaseProps<T>, ActionIconProps {
	onClick?: (index: TableNode<T>['index']) => void;
}
export interface TableBodyCellWrapProps<T = object> {
	node?: TableNode<T>;
	column: ColumnEntity<T>;
	children?: React.ReactNode;
	onClick?: () => void;
	level?: number;
}
export interface TableBodyCellSlotProps<T = object> extends TableBodyCellBaseProps<T> {
	onClick?: () => void;
}


export interface TableBodyCellProps<T = object> extends TableBodyCellBaseProps<T> {
	level?: number;
}
export interface TableBodyCellExpandProps<T = object> extends TableBodyCellBaseProps<T> {
	level?: number;
}
export interface TableBodyCellExpanderProps<T = object> extends TableBodyCellBaseProps<T> {

}


export function TableBodyExpander<T = object>({ node, column, onClick, ...props }: TableBodyExpanderProps<T>) {
	if (!column.isGroup && !column.isGrouped) {
		return null;
	}
	const { expands, toggleExpand, groupAt } = useTableDataContext();
	const isExpand = expands.includes(node.index);
	return <Box ta='center'><ActionIcon variant="subtle" {...props} style={{
			...props.style,
			transition: 'rotate 0.3s ease',
			rotate: isExpand && groupAt === 'end'? '-90deg': isExpand? '90deg': ''
		}} onClick={() => (onClick || toggleExpand)(node.index)}>
		{groupAt === 'end' ? <TbCircleChevronLeft />: <TbCircleChevronRight />}
	</ActionIcon></Box>
}


export function TableBodyCellWrap<T = object>({ node, column, level = 0, onClick, children }: TableBodyCellWrapProps<T>) {
	return <Table.Td onClick={onClick} style={{
		...(typeof column.style === 'function'? column.style?.(column, node): column.style || {}),
		paddingLeft: column.isGrouped || column.isGroup? `calc(calc(var(--mantine-spacing-base, 0.25rem) * var(--mantine-scale)) * 9 * ${level} + var(--table-horizontal-spacing, 0.5rem))`: '',
	}}>
		{children? <Group justify="flex-start" align="center" grow wrap="nowrap">{children}</Group>: null}
	</Table.Td>
}
export function TableBodyCellSlot<T = object>({ node: { data }, column, onClick }: TableBodyCellSlotProps<T>) {
	return <Text flex='1' maw='100%' onClick={onClick}>{column.body?.(data, column) || data?.[column.field]}</Text>
}


export function TableBodyCellExpand<T = object>({ node, column, level = 0 }: TableBodyCellExpandProps<T>) {
	if (!node.data[column.field]) {
		return <TableBodyCellWrap<T> column={column} />
	}
	return <TableBodyCellWrap<T> node={node} column={column} level={level}>
		<TableBodyExpander<T> node={node} column={column} />
	</TableBodyCellWrap>
}

export function TableBodyCellExpander<T = object>({ node, column }: TableBodyCellExpanderProps<T>) {
	if (!node.nodes?.length) {
		return null
	}
	return <TableBodyExpander<T> node={node} column={column} flex='0' />
}



export function TableBodyCell<T = object>({ node, column, level = 0 }: TableBodyCellProps<T>) {
	if (column.isGroup) {
		return <TableBodyCellExpand<T> node={node} column={column} level={level} />
	}
	const { editorMode, handleModeChange, handleSaveItem, clearModeChange, groupAt } = useTableDataContext();
	return <TableBodyCellWrap<T> level={level} column={column} node={node}>
		{groupAt === 'start' && <TableBodyCellExpander<T> node={node} column={column} />}
		{editorMode(node, column) && column.editor?.(node.data, column, (value) => {
			node.data[column.field] = value;
		}, () => {
			handleSaveItem(node.data, node.index)
			clearModeChange()
		}) || <TableBodyCellSlot<T> node={node} column={column} onClick={() => handleModeChange(node, column)} />}
		{groupAt === 'end' && <TableBodyCellExpander<T> node={node} column={column} />}
	</TableBodyCellWrap>
}
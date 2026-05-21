import { ActionIcon, Table } from "@mantine/core";
import { TbCircleChevronRight } from 'react-icons/tb';
import { useTableDataContext } from '../context';
import { type ColumnEntity } from "../DataColumn";
import { type TableNode } from '../TableData';

export interface TableBodyCellProps<T> {
	node: TableNode<T>;
	column: ColumnEntity<T>;
}
export interface TableBodyCellSlotProps<T> {
	data: T;
	column: ColumnEntity<T>;
}
export interface TableBodyCellGroupProps<T> {
	node: TableNode<T>;
	column: ColumnEntity<T>;
}


export function TableBodyCellSlot<T = object>({ data, column }: TableBodyCellSlotProps<T>) {
	return column.body?.(data, column) || data?.[column.field] || ''
}
export function TableBodyCellExpand({ node, column }: TableBodyCellGroupProps) {
	if (!node.data[column.field]) {
		return <Table.Td></Table.Td>
	}
	const { expands, toggleExpand } = useTableDataContext();
	const isExpand = expands.includes(node.index);
	return <Table.Td>
		<ActionIcon variant="subtle" style={{
			animate: 'rotate 0.3s ease',
			rotate: isExpand? '90deg': ''
		}} onClick={() => toggleExpand(node.index)}>
			<TbCircleChevronRight />
		</ActionIcon>
	</Table.Td>
}

export function TableBodyCell<T = object>({ node, column }: TableBodyCellProps<T>) {
	if (column.isGroup) {
		return <TableBodyCellExpand node={node} column={column} />
	}
	const { editorMode, handleModeChange, handleSaveItem, clearModeChange } = useTableDataContext();
	return <Table.Td onClick={() => handleModeChange(node, column)} style={typeof column.style === 'function'? column.style?.(node): column.style || {} }>
		{editorMode(node, column) && column.editor?.(node.data, column, (value) => {
			node.data[column.field] = value;
		}, () => {
			handleSaveItem(node.data, node.index)
			clearModeChange()
		}) || <TableBodyCellSlot<T> data={node.data} column={column} />}
	</Table.Td>
}
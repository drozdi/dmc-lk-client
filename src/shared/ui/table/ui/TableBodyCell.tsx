import { Table } from "@mantine/core";
import { useTableDataContext } from '../context';
import { type ColumnEntity } from "../DataColumn";
import { type TableNode } from '../TableData';

export interface TableBodyCellProps<T> {
	item: TableNode<T>;
	column: ColumnEntity<T>;
}
export interface TableBodyCellSlotProps<T> {
	data: T;
	column: ColumnEntity<T>;
}



export function TableBodyCellSlot<T = object>({ data, column }: TableBodyCellSlotProps<T>) {
	return column.body?.(data, column) || data?.[column.field] || ''
}

export function TableBodyCell<T = object>({ item, column }: TableBodyCellProps<T>) {
	const { editorMode, handleModeChange, handleSaveItem, clearModeChange } = useTableDataContext();
	return <Table.Td onClick={() => handleModeChange(item, column)} style={typeof column.style === 'function'? column.style?.(column, item): column.style || {} }>
		{editorMode(item, column) && column.editor?.(item.data, column, (value) => {
			item.data[column.field] = value;
		}, () => {
			handleSaveItem(item.data, item.index)
			clearModeChange()
		}) || <TableBodyCellSlot<T> data={item.data} column={column} />}
	</Table.Td>
}
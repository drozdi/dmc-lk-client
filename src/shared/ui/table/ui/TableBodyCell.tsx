import { Table } from "@mantine/core";
import { useTableDataContext } from '../context';
import { type ColumnEntity } from "../DataColumn";
import { type TableNode } from '../TableData';

export interface TableBodyCellProps<T> {
	item: TableNode<T>;
	column: ColumnEntity<T>;
}

export function TableBodyCell<T = object>({ item, column }: TableBodyCellProps<T>) {
	const { editorMode, handleModeChange, handleSaveItem, clearModeChange } = useTableDataContext();
	return <Table.Td onClick={() => handleModeChange(item, column)}>
		{editorMode(item, column) && column.editor?.(item.data, column, (value) => {
			item.data[column.field] = value;
		}, () => {
			handleSaveItem(item.data, item.index)
			clearModeChange()
		}) || column.body?.(item.data, column) || item.data?.[column.field] || ''}
	</Table.Td>
}
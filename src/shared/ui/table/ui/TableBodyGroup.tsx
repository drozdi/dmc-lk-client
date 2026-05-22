import { Collapse, Table } from "@mantine/core";
import { useTableDataContext } from '../context';
import { type ColumnEntity } from "../DataColumn";
import { TableData, type TableNode } from "../TableData";
export interface TableBodyGroupProps<T = object> {
	node: TableNode<T>;
	columns: ColumnEntity<T>[];
	column: ColumnEntity<T>;
	level?: number;
}

export function TableBodyGroup<T = object>({ node, columns, column, level = 0 }: TableBodyGroupProps<T>) {
	if (!column.isGroup || !(node.data?.[column.field] as T[])?.length) {
		return null;
	}
	const { props, expands, colspan, groupAt } = useTableDataContext();
	const isExpand = expands.includes(node.index);
	return <Table.Tr style={{
			borderBottomWidth: isExpand? '2px': ''
		}}>
			{groupAt === 'start' && <Table.Td colSpan={columns.length - colspan} p='0'></Table.Td>}
			<Table.Td colSpan={colspan} p='0'>
					<Collapse expanded={isExpand}>
						<TableData<T> data={node.data[column.field]} columns={columns.filter((column) => !column.isGroup)} level={level} withHeader={false} withPagination={false} {...props} />
					</Collapse>
			</Table.Td>
			{groupAt === 'end' && <Table.Td colSpan={columns.length - colspan} p='0'></Table.Td>}
		</Table.Tr>
}
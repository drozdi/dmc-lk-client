import { Table } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Children, useCallback, useMemo } from "react";
import { TableBody } from "./ui/TableBody";
import { TableHeader } from "./ui/TableHeader";
import { type ColumnEntity, type XColumnProps } from "./XColumn";
import { XTablerProvider } from './XTableContext';

export interface TableNode<T = object> {
	data: T;
	index: string | number;
	expand: [boolean, {
		set: (value: boolean) => void;
    open: () => void;
    close: () => void;
    toggle: () => void;
	}];
	isParent: boolean;
	isChildren: boolean;
	nodes: TableNode<T>[];
}

function convertNodes<T = object>(items: T[]): TableNode<T>[] {
	return Object.entries(items).map(([index, item]) => {
		return {
			data: item,
			index,
			expand: useDisclosure(false),
			isParent: false,
			isChildren: false,
			nodes: [],
		};
	});
}
function groupBy<T = object>(nodes: TableNode<T>[], key: keyof T | undefined): TableNode<T>[] {
	if (!key) {
		return nodes;
	}
	const groups = new Map<T[keyof T], TableNode<T>[]>();

  for (const node of nodes) {
    const groupValue = node.data[key];
    if (!groups.has(groupValue)) {
      groups.set(groupValue, []);
    }
    groups.get(groupValue)!.push(node);
  }


	const result: TableNode<T>[] = [];

  for (const group of groups.values()) {
    if (group.length === 0) {
			continue; 
		}
    const [first, ...rest] = group;
    first.nodes = rest.map(child => {
      child.isChildren = true;
      return child;
    });
    first.isParent = rest.length > 0;
    result.push(first);
  }

  return result;
}
function sortBy<T = object>(nodes: TableNode<T>[], key: keyof T, descending = false): TableNode<T>[] {
	let result = [...nodes];
	const fn = (a, b) => {
		a = a.data;
		b = b.data;
		if (a[key] > b[key]) {
			return descending ? -1 : 1;
		}
		if (a[key] < b[key]) {
			return descending ? 1 : -1;
		}
		return 0;
	};
	result.sort(fn);
	return result.map((val) => {
		Array.isArray(val.nodes) && val.nodes.sort(fn);
		return val;
	});
}

export interface XTableProps<T = object> {
	children?: React.ReactNode;
	data: T[];
	groupAt?: "begin" | "end";
}

const calculateColspan = (children) => {
	if (!children) {
		return 1;
	}
	return Children.toArray(children).reduce((sum, child) => {
		return sum + calculateColspan(child.props.children);
	}, 0);
};
const calculateIsColumns = (children) => {
	if (!children) return false;
	return Children.count(children) > 0;
};

export function XTable<T = object>({ groupAt = 'begin', children, data = [], ...props }: XTableProps<T>) {
	const columnsRef = useMemo<ColumnEntity<T>[]>(() => {
		function calculateColumn(column: XColumnProps<T>, level = 0): ColumnEntity<T> {
			const col: ColumnEntity<T> = {
				size: 1,
				level: level + 1,
				parentLevel: level,
				columns: [],
				isColumns: calculateIsColumns(column.children),
				isHeader: !!column.header,
				isField: !!column.field,
				isEmpty: !column.field,
				isSorted: !!column.sortable,
				isToggleable: !!column.toggleable,
				colspan:
					calculateColspan(column.children) ||
					column.size ||
					1,
				...column,
				children: undefined,
			};
			col.columns = Children.toArray(column.children).map((child) => {
				return calculateColumn(child.props, col.level)
			})
			return col
		}
		
		const ret: ColumnEntity<T>[] = []

		Children.forEach(children, (child) => {
			child?.props &&	ret.push(calculateColumn(child.props))
		})

		return ret
	},[children])

	const columns = useMemo(
		() =>
			[...columnsRef].sort((a, b) => {
				if (a.isGrouped) {
					return groupAt === "begin" ? -1 : 1;
				}
				if (b.isGrouped) {
					return groupAt === "begin" ? 1 : -1;
				}
				return 0;
			}),
		[columnsRef, groupAt]
	);

	const primaryKey = useMemo<string[]>(() => {
		return columns.filter(v => v.id && v.field).map(v => v.field)
	}, [columns])

	const genId = useCallback((item: T, index) => {
		if (primaryKey.length) {
			const ret = []
			for (const key of primaryKey) {
				res.push(item[key] || '')
			}
			return ret.join("_")
		}
		return index;
	}, [primaryKey])

	const nodes = convertNodes(data);




	return (
		<XTablerProvider value={{}}>
			<Table layout="fixed">
				<Table.Thead><TableHeader<T> columns={columns} /></Table.Thead>
				<Table.Tbody><TableBody<T> data={nodes} columns={columns} /></Table.Tbody>
			</Table>
		</XTablerProvider>
	);
};


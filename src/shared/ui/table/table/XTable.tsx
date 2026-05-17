import { Table } from '@mantine/core';
import { useDisclosure, useListState } from '@mantine/hooks';
import { useMemo } from "react";
import { TableBody } from "./ui/TableBody";
import { TableHeader } from "./ui/TableHeader";
import { XTablerColumsProvider } from "./XTableColumsContext";

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
	const result: Record<T<keyof T>, TableNode<T>> = {};
	nodes.forEach((node) => {
		if (node.data[key]) {
			if (!result[node.data[key]]) {
				result[node.data[key]] = [];
			}
			result[node.data[key]].push(node);
		} else {
			result[node.index] = node;
		}
	});
	return Object.values(result).map((val) => {
		if (Array.isArray(val)) {
			val[0].nodes = val.slice(1).map((node) => {
				node.isChildren = true;
				return node;
			});
			val[0].isParent = !!val[0].nodes.length;
			return val[0];
		}
		return val;
	});
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

export function XTable<T = object>({ groupAt = 'begin', children, data = [], ...props }: XTableProps<T>) {

	const [
		columnsRef,
		{
			append,
			filter,
		},
	] = useListState();

	const context = useMemo(
		() => ({
			addColumn(column) {
				if (columnsRef.findIndex((v) => v.uid === column.uid) === -1){
					append(column);
				}
			},
			delColumn(column) {
				filter((v) => v.uid !== column.uid);
			},
		}),
		[columnsRef]
	);

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

	console.log(columns)


	return (
		<XTablerColumsProvider value={context}>
			{children}
			<Table layout="fixed">
				<Table.Thead><TableHeader<T> columns={columns} /></Table.Thead>
				<Table.Tbody><TableBody data={data} columns={columns} /></Table.Tbody>
			</Table>
		</XTablerColumsProvider>
	);
};


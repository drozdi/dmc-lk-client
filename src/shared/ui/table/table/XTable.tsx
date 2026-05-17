import { Table } from '@mantine/core';
import { useListState } from "@mantine/hooks";
import { useMemo } from "react";
import { XTablerColumsProvider } from "./XTableColumsContext";
import { TableHeader } from "./ui/TableHeader";

import { ColumnEntity } from './XColumn';
// function convertNodes(items) {
// 	return Object.entries(items).map(([index, item]) => {
// 		return {
// 			data: item,
// 			index,
// 			expand: useToggle(),
// 			isParent: false,
// 			isChildren: false,
// 			nodes: [],
// 		};
// 	});
// }
// function groupBy(nodes, key = false) {
// 	if (!key) {
// 		return nodes;
// 	}
// 	const result = {};
// 	nodes.forEach((node) => {
// 		if (node.data[key]) {
// 			if (!result[node.data[key]]) {
// 				result[node.data[key]] = [];
// 			}
// 			result[node.data[key]].push(node);
// 		} else {
// 			result[node.index] = node;
// 		}
// 	});
// 	return Object.values(result).map((val) => {
// 		if (isArray(val)) {
// 			val[0].nodes = val.slice(1).map((node) => {
// 				node.isChildren = true;
// 				return node;
// 			});
// 			val[0].isParent = !!val[0].nodes.length;
// 			return val[0];
// 		}
// 		return val;
// 	});
// }
// function sortBy(nodes, key, descending) {
// 	let result = [...nodes];
// 	const fn = (a, b) => {
// 		a = a.data;
// 		b = b.data;
// 		if (a[key] > b[key]) {
// 			return descending ? -1 : 1;
// 		}
// 		if (a[key] < b[key]) {
// 			return descending ? 1 : -1;
// 		}
// 		return 0;
// 	};
// 	result.sort(fn);
// 	return result.map((val) => {
// 		isArray(val.nodes) && val.nodes.sort(fn);
// 		return val;
// 	});
// }

export interface XTableProps<T = object> {
	children?: React.ReactNode;
	data: T[];
}

export function XTable<T = object>({ children, data = [], ...props }: XTableProps<T>) {
	props.groupAt = props.groupAt || "begin";
	// const sort = useRef({
	// 	key: props.sortKey,
	// 	descending: props.sortDesc,
	// });
	// function editable(data, index) {
	// 	return typeof props.editable === "function"
	// 		? props.editable(data, index)
	// 		: props.editable;
	// }
	// const onSort = useCallback(
	// 	(key) => {
	// 		if (sort.current.key === key) {
	// 			if (sort.current.descending) {
	// 				sort.current.descending = false;
	// 			} else {
	// 				sort.current.key = null;
	// 				sort.current.descending = true;
	// 			}
	// 		} else {
	// 			sort.current.key = key;
	// 			sort.current.descending = true;
	// 		}
	// 	},
	// 	[sort]
	// );

	// const getSlot = (column, name) => {
	// 	return column?.[name];
	// };

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
				if (columnsRef.findIndex(item => item.id === column.id) > -1) {
					append(column);
				}
			},
			delColumn(column) {
				filter((v) => v.uid !== column.uid);
			},
		}),
		[columnsRef]
	);

	const columns = useMemo<ColumnEntity<T>[]>(
		() =>
			[...columnsRef].sort((a, b) => {
				if (a.isGrouped) {
					return props.groupAt === "begin" ? -1 : 1;
				}
				if (b.isGrouped) {
					return props.groupAt === "begin" ? 1 : -1;
				}
				return 0;
			}),
		[columnsRef, props.groupAt]
	);

	// const fields = useMemo(() => {
	// 	let ret = [];
	// 	(function recursive(columns) {
	// 		for (let i = 0, cnt = columns.length; i < cnt; i++) {
	// 			if (columns[i].isEmpty && columns[i].isColumns) {
	// 				recursive(columns[i].columns);
	// 			} else {
	// 				ret.push(columns[i]);
	// 			}
	// 		}
	// 	})(columns);
	// 	return ret.filter(
	// 		(v) =>
	// 			v.field &&
	// 			(props.column?.isGrouped || v.field != props.column?.field)
	// 	);
	// }, [columns, props.column]);

	const rowspan = useMemo(() => {
		let max = 0;
		(function recursive(columns) {
			for (let i = 0; i < columns.length; i++) {
				max = max > columns[i].level ? max : columns[i].level;
				if (columns[i].isColumns) {
					recursive(columns[i].columns);
				}
			}
		})(columns);
		return max;
	}, [columns]);

	const colspan = useMemo(
		() =>
			columns.reduce((sum, column) => {
				return sum + (column.isGroup ? 0 : column.colspan);
			}, 0) || 1,
		[columns]
	);

	// const groupKey = useMemo(() => {
	// 	for (let i = 0; i < fields.length; i++) {
	// 		if (fields[i].isGrouped && !fields[i].isGroup) {
	// 			return fields[i].field;
	// 		}
	// 	}
	// 	return null;
	// }, [fields]);

	/*console.log("columns", columns);
	console.log("fields", fields);
	console.log("rowspan", rowspan);
	console.log("colspan", colspan);
	console.log("groupKey", groupKey);//*/
	//
	//
	//

	// let nodes = convertNodes(values);
	// if (groupKey) {
	// 	nodes = groupBy(nodes, groupKey);
	// }
	// if (sort.current.key) {
	// 	nodes = sortBy(nodes, sort.current.key, sort.current.descending);
	// }

	// const onToggle = useCallback((node) => {
	// 	node.expand?.[1]();
	// }, []);

	// function genTBodyGrouped(nodes, expand) {
	// 	return nodes.map((node) => {
	// 		return genTBodyRow(node, expand);
	// 	});
	// }

	// function genTBodyGroup(node, column) {
	// 	if (!node.data[column.field]) {
	// 		return [];
	// 	}
	// 	return h(
	// 		XTable,
	// 		{
	// 			...props,
	// 			key: column.uid,
	// 			if: () => node.expand[0] || false,
	// 			column: column,
	// 			sortKey: sort.current.key,
	// 			sortDesc: sort.current.descending,
	// 			expand: node.expand[0] || false,
	// 			values: node.data[column.field],
	// 			border: undefined,
	// 			children: undefined,
	// 		},
	// 		getSlot(
	// 			column,
	// 			"body"
	// 		)?.({
	// 			field: column.field,
	// 			header: column.header,
	// 			data: node.data,
	// 			index: node.index,
	// 			expand: node.expand,
	// 			isParent: node.isParent,
	// 			isChildren: node.isChildren,
	// 		}) || children
	// 	);
	// }

	// function genTBodyCellExpand(node, column) {
	// 	return (
	// 		<Table.Td
	// 			key={column.field}
	// 			role="cell"
	// 			colSpan={column.colspan}
	// 		>
	// 			<div className={`x-table-td-value text-${column.align}`}>
	// 				<XBtn
	// 					round
	// 					rightSection={`mdi-${
	// 						node.expand[0] ? "minus-box" : "plus-box"
	// 					}`}
	// 					onClick={() => onToggle(node)}
	// 				/>
	// 			</div>
	// 		</Table.Td>
	// 	);
	// }

	// function genTBodyCell(node, column) {
	// 	if (column.isGrouped && !isEmpty(node.nodes)) {
	// 		return genTBodyCellExpand(node, column);
	// 	} else if (
	// 		column.isGrouped &&
	// 		column.isGroup &&
	// 		node.data[column.field]
	// 	) {
	// 		return genTBodyCellExpand(node, column);
	// 	} else if (column.isGrouped) {
	// 		return <Table.Td key={column.field}></Table.Td>;
	// 	}
	// 	return (
	// 		<Table.Td
	// 			key={column.field}
	// 			role="cell"
	// 			colSpan={column.colspan}
	// 		>
	// 			<div className="x-table-td-title">
	// 				{getSlot(column, "label")?.({ column, data: node.data }) ||
	// 					column.header}
	// 			</div>
	// 			<div className={`x-table-td-value text-${column.align}`}>
	// 				{(
	// 					getSlot(
	// 						column,
	// 						editable(node) === true ? "editor" : "body"
	// 					) || getSlot(column, "body")
	// 				)?.({
	// 					field: column.field,
	// 					header: column.header,
	// 					colspan: column.colspan,
	// 					data: node.data,
	// 				}) || node.data[column.field]}
	// 			</div>
	// 		</Table.Td>
	// 	);
	// }

	// function genTBodyRowSeparate(node) {
	// 	return (
	// 		<Table.Tr
	// 			key={node.index + "-s"}
	// 			if={() => node.expand[0]}
	// 			className="x-no-hover"
	// 			role="cell"
	// 		>
	// 			<Table.Td colSpan={colspan}></Table.Td>
	// 		</Table.Tr>
	// 	);
	// }

	// function genTBodyRow(node, expand = [true]) {
	// 	let rows = [];
	// 	let append = [];
	// 	(function recursive(node, fields) {
	// 		let row = [];
	// 		fields.forEach((column) => {
	// 			if (column.isGroup) {
	// 				append = append.concat(genTBodyGroup(node, column));
	// 				if (!column.isGrouped) return;
	// 			} else if (column.isGrouped && node.nodes) {
	// 				append = genTBodyGrouped(node.nodes, node.expand);
	// 			}
	// 			row.push(genTBodyCell(node, column));
	// 		});
	// 		rows.push(
	// 			<Table.Tr
	// 				if={() => expand?.[0]}
	// 				key={node.index}
	// 				role="row"
	// 			>
	// 				{row}
	// 			</Table.Tr>
	// 		);
	// 	})(node, fields);
	// 	if (props.separate && append.length > 0) {
	// 		append.push(genTBodyRowSeparate(node));
	// 	}
	// 	return rows.concat(append);
	// }

	// function genTBody() {
	// 	return nodes.map((node) => {
	// 		if (props.column?.isGrouped) {
	// 			return genTBodyRow(node, [props.expand]);
	// 		}
	// 		return genTBodyRow(node);
	// 	});
	// }

	// if (props.column) {
	// 	return (
	// 		<XTablerColumsProvider value={context}>
	// 			{children}
	// 			{genTBody()}
	// 		</XTablerColumsProvider>
	// 	);
	// }

	return (
		<XTablerColumsProvider value={context}>
			{children}
			<Table layout="fixed">
				<Table.Thead><TableHeader<T> columns={columns} /></Table.Thead>
			</Table>
		</XTablerColumsProvider>
	);
};


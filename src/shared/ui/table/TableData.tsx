import { useBreakpoint } from '@/shared/hooks';
import { Box, Card, Group, SimpleGrid, Table, Text } from '@mantine/core';
import React, { Children, useCallback, useEffect, useMemo, useState } from "react";
import { Loading } from '../loading';
import { type ColumnEntity, type DataColumnProps } from "./DataColumn";
import { TableDataProvider } from './context/TableDataContext';
import { TableBody, TableBodyCellSlot, TableHeader, TableHeaderCellSlot } from "./ui";
import { TablePagination, type TablePaginationProps } from './ui/TablePagination';

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
	return Object.entries(items).map(([index, item]) => ({
			data: item,
			index,
			//expand: useDisclosure(false),
			isParent: false,
			isChildren: false,
			nodes: [],
		})
	);
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
function limitBy<T = object>(nodes: TableNode<T>[], limit: number, offset: number): TableNode<T>[] {
	return nodes.slice((offset-1)*limit, offset*limit)
}

function calculateColspan(children) {
	if (!children) {
		return 1;
	}
	return Children.toArray(children).reduce((sum, child) => {
		return sum + calculateColspan(child.props.children);
	}, 0);
};
function calculateIsColumns(children) {
	if (!children) return false;
	return Children.count(children) > 0;
};

export interface TableDataProps<T = object> {
	loading?: boolean;
	children?: React.ReactNode;
	data: T[] | ((limit: number, page: string | number) => Promise<{
		data: T[],
		next: string | number
	}>);
	groupAt?: "start" | "end";
	sortKey?: keyof T,
	sortDesc?: boolean
	limit?: number,
	limits?: number[],
	page?: number,
	total?: number
	editMode?: 'row' | 'cell',
	onRowEditComplete?: (item: T, index: TableNode<T>['index']) => void,
	withHeader?: boolean,
	withPagination?: boolean,
	breakpoint?: string
	layout?: React.FC<{
		nodes: TableNode<T>[],
		columns: ColumnEntity<T>[]
	}>
	pagination?: React.FC<TablePaginationProps<T>>
}

export function TableData<T = object>({
	loading: loadingProps,
	children,
	groupAt = 'start', 
	sortKey, 
	sortDesc = false, 
	data: dataProps,
	limits = [15, 30, 50, 75, 100], 
	limit: limitProps = limits[0] || 15, 
	page: pageProps = 1, 
	total: totalProps,
	withHeader = true,
	withPagination = true,
	breakpoint: breakpointProps,
	layout: Layout = ({nodes, columns}) => {
		return <SimpleGrid cols={2}>
			{nodes.map((item) => <Card key={item.index} withBorder>
				{columns.filter(column => column.isField).map((column) => <Group key={column.field as string} align='flex-end' justify='space-between' grow style={{
					borderBottom: '1px dashed var(--mantine-color-default-border)',
				}}>
					<TableHeaderCellSlot<T> column={column} />
					<Text flex={0} fw={600} >
						<TableBodyCellSlot<T> data={item.data} column={column} />
					</Text>
				</Group>)}
			</Card>)}
		</SimpleGrid>
	},
	pagination: Pagination = TablePagination,
	onRowEditComplete,
	editMode,
	...props }: TableDataProps<T>) {
	const [limit, setLimit] = useState(limitProps)
	const [page, setPage] = useState<number>(pageProps)
	const [next, setNext] = useState<string | number>('')
	const [history, setHistory] = useState<(string | number)[]>([])
	const [data, setData] = useState<T[]>(Array.isArray(dataProps)? dataProps: [])
	const [isLoading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string>('')
	const breakpoint = !!breakpointProps && useBreakpoint(breakpointProps);
	const loading = useMemo<boolean>(() => loadingProps || isLoading, [loadingProps, isLoading])


	const [sort, setSort] = useState<{
		key?: keyof T | undefined,
		descending: boolean
	}>({ key: sortKey, descending: sortDesc})
	const changeSort = useCallback((field: keyof T) => {
		setSort(v => {
			if (v.key === field) {
				if (v.descending) {
					return {...v, descending: false }
				} else {
					return {
						key: undefined,
						descending: true
					}
				}

			} else {
				return {
					key: field,
					descending: true
				}
			}
		})
	}, [])
	const columnsRef = useMemo<ColumnEntity<T>[]>(() => {
		function calculateColumn(column: DataColumnProps<T>, level = 0): ColumnEntity<T> {
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
					return groupAt === "start" ? -1 : 1;
				}
				if (b.isGrouped) {
					return groupAt === "start" ? 1 : -1;
				}
				return 0;
			}),
		[columnsRef, groupAt]
	);
	const fetcher = typeof dataProps === 'function'

	const fetch = useCallback((page: string | number = '', saveHistory = true) => {
		if (typeof dataProps !== 'function') {
			return
		}
		setLoading(true)
		dataProps(limit, page).then(({ data, next }) => {
			setData(data)
			setNext(next)
			setLoading(false)
			saveHistory && setHistory(v => [...v, page])
		}).catch((error: IError) => {
			setError(error.response?.data?.detail || error?.message || "Ошибка загрузки данных!")
			setLoading(false)
		})
	}, [dataProps, limit])

	useEffect(() => {
		setHistory([])
		fetch('');
	}, [fetch])

	useEffect(() => {
		setLimit(limitProps)
		setPage(pageProps)
	}, [limitProps, pageProps])

	useEffect(() => {
		setData(Array.isArray(dataProps)? dataProps: [])
	}, [dataProps])

	
	let nodes:TableNode<T>[] = convertNodes(data);
	const total = totalProps || nodes.length
	if (!fetcher && limit > 0) {
		nodes = limitBy(nodes, limit, page)
	}
	if (sort.key) {
		nodes = sortBy(nodes, sort.key, sort.descending);
	}	

	const handlerNext = function () {
		fetcher && fetch(next, true)
	}
	const handlerPprevious = function () {
		history.pop()
		setHistory([...history])
		fetcher && fetch(history.pop(), false)
	}

	const [editableMeta, setEditableMeta] = useState<{
		columns: ColumnEntity<T>['field'][]
		index: TableNode<T>['index']
	}>({
		columns: [],
		index: 0
	})
	const handleModeChange = useCallback((item: TableNode<T>, column: ColumnEntity<T>) => {
		if (!editMode) {
			return
		}
		if (editMode === 'row') {
			setEditableMeta({
				index: item.index,
				columns: columns.filter(v => v.isField).map(v => v.field)
			})
		} else if (editMode === 'cell') {
			setEditableMeta({
				index: item.index,
				columns: [column.field]
			})
		}
	}, [editMode, columns])
	const clearModeChange = useCallback(() => {
		setEditableMeta({
			index: 0,
			columns: []
		})
	}, [])
	const editorMode = useCallback((item: TableNode<T>, column: ColumnEntity<T>): boolean => {
		if (!editMode) {
			return false
		}
		if (editableMeta.index === item.index && editableMeta.columns.includes(column.field)) {
			return true
		}
		return false;
	}, [editMode, editableMeta])
	
	const handleSaveItem = useCallback((item: T, index: TableNode<T>['index']) => {
		onRowEditComplete?.(item, index)
	}, [clearModeChange, onRowEditComplete])

	const render = useCallback<(nodes: TableNode<T>[], columns:ColumnEntity<T>[]) => React.ReactNode>((nodes: TableNode<T>[], columns:ColumnEntity<T>[]) => {
		if (breakpoint && Layout) {
			return <Layout nodes={nodes} columns={columns} />
		}
		return <Table layout="fixed">
			{withHeader && <Table.Thead><TableHeader<T> columns={columns} /></Table.Thead>}
			<Table.Tbody><TableBody<T> data={nodes} columns={columns} /></Table.Tbody>
		</Table>
	}, [withHeader, breakpoint, columns, nodes])

	return (
		<TableDataProvider value={useMemo(() => ({
			sort, changeSort, breakpoint, editorMode, handleModeChange, clearModeChange, handleSaveItem
		}), [sort, changeSort, breakpoint, editorMode, handleModeChange, clearModeChange, handleSaveItem])}>
			<Box>
				<Loading active={loading} keepMounted>
					{render(nodes, columns)}
				</Loading>
				{withPagination && <Pagination
					loading={isLoading}
					onNext={fetcher? handlerNext: undefined}
					onPprevious={fetcher? handlerPprevious: undefined}
					activePprevious={history.length > 1}
					activeNext={!!next}
					page={page}
					total={Math.ceil(total/limit)}
					limit={limit}
					limits={limits}
					onChangePage={setPage}
					onChangeLimit={(val) => {
						setPage(1)
						setLimit(val)
					}}
				/> }
			</Box>
		</TableDataProvider>
	);
};


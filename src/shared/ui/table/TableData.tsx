import { useBreakpoint } from '@/shared/hooks';
import { Card, Group, SimpleGrid, Stack, Table, Text, type TableProps } from '@mantine/core';
import { useMounted } from '@mantine/hooks';
import { Children, useCallback, useEffect, useMemo, useState } from "react";
import { Loading } from '../loading';
import { type ColumnEntity, type DataColumnProps } from "./DataColumn";
import { TableDataProvider } from './context/TableDataContext';
import { TableBody, TableBodyCellSlot, TableEmpty, TableHeader, TableHeaderCellSlot, TablePagination, type TablePaginationProps } from "./ui";
import { calculateColspan, calculateIsColumns, convertNodes, groupBy, limitBy, sortBy } from './utils';

export interface TableNode<T = object> {
	data: T;
	index: string | number;
	isParent: boolean;
	isChildren: boolean;
	nodes: TableNode<T>[];
}

export interface TableDataProps<T = object> extends Omit<TableProps, 'layout' | 'data'> {
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
	minHeight?: number
	noDataText?: string
	multiple?: boolean
	level?: number,
	columns?: ColumnEntity<T>[]
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
	layout: Layout = ({nodes, columns}) => <SimpleGrid cols={2}>
		{nodes.map((node) => <Card key={node.index} withBorder>
			{columns.filter(column => column.isField).map((column) => <Group key={column.field as string} align='flex-end' justify='space-between' grow style={{
				borderBottom: '1px dashed var(--mantine-color-default-border)',
			}}>
				<TableHeaderCellSlot<T> column={column} />
				<Text flex={0} fw={600} >
					<TableBodyCellSlot<T> node={node} column={column} />
				</Text>
			</Group>)}
		</Card>)}
	</SimpleGrid>,
	
	minHeight,
	pagination: Pagination = TablePagination,
	onRowEditComplete,
	editMode,
	multiple,
	noDataText = 'No records',
	level = 0,
	columns: columnsProps,
	...other }: TableDataProps<T>) {
	const props = useMemo(() => ({
  	striped: true,
		highlightOnHover: true,
		horizontalSpacing: '0.5rem',
		verticalSpacing: '0.5rem',
		...other
	}), [other]);
	const [limit, setLimit] = useState(limitProps)
	const [page, setPage] = useState<number>(pageProps)
	const [next, setNext] = useState<string | number>('')
	const [history, setHistory] = useState<(string | number)[]>([])
	const [data, setData] = useState<T[]>(Array.isArray(dataProps)? dataProps: [])
	const [sort, setSort] = useState<{
		key?: keyof T | undefined,
		descending: boolean
	}>({ key: sortKey, descending: sortDesc})
	const [editableMeta, setEditableMeta] = useState<{
		columns: ColumnEntity<T>['field'][]
		index: TableNode<T>['index']
	}>({
		columns: [],
		index: 0
	})
	const [isLoading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string>('')
	const breakpoint = !!breakpointProps && useBreakpoint(breakpointProps);
	const loading = useMemo<boolean>(() => loadingProps || isLoading, [loadingProps, isLoading])
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
		if (columnsProps) {
			return columnsProps
		}

		function calculateColumn(column: DataColumnProps<T>, level = 0): ColumnEntity<T> {
			const col: ColumnEntity<T> = {
				size: 1,
				level: level + 1,
				parentLevel: level,
				columns: [],
				isColumns: calculateIsColumns(column.children),
				isResizable: !!column.resizable,
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
	},[columnsProps, children])
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
	const mounted = useMounted();
	const fetcher = typeof dataProps === 'function'

	const fetch = useCallback((page: string | number = '', saveHistory = true) => {
		if (!mounted || typeof dataProps !== 'function') {
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
	}, [dataProps, limit, mounted])

	const groupKey = useMemo<ColumnEntity<T>['field'] | undefined>(() => {
		for (const column of columns) {
				if (column.isGrouped && !column.isGroup) {
				return column.field;
			}
		}
		return undefined;
	}, [columns]);

	const rowspan = useMemo(() => {
		let max = 0;
		(function recursive(columns: ColumnEntity<T>[]) {
			for ( const column of columns ) {
				max = max > column.level ? max : column.level;
				if (column.isColumns) {
					recursive(column.columns);
				}
			}
		})(columns);
		return max;
	}, [columns]);
	const colspan = useMemo(
		() =>
			columns.reduce((sum: number, column: ColumnEntity<T>) => {
				return sum + (column.isGroup ? 0 : column.colspan);
			}, 0) || 1,
		[columns]
	);
	
	let total = totalProps || data?.length
	const nodes:TableNode<T>[] = useMemo<TableNode<T>[]>(() => {
		let nodes:TableNode<T>[] = convertNodes(data);
		if (groupKey) {
			nodes = groupBy(nodes, groupKey);
		}
		total = totalProps || nodes?.length
		if (!fetcher && limit > 0) {
			nodes = limitBy(nodes, limit, page)
		}
		if (sort.key) {
			nodes = sortBy(nodes, sort.key, sort.descending);
		}	
		return nodes
	}, [data, sort, groupKey, limit, page]);

	const handlerNext = function () {
		if (fetcher) {
			fetch(next, true)
		}
	}
	const handlerPprevious = useCallback(function () {
		setHistory((prev) => {
			const newHistory = [...prev]
			newHistory.pop(); // удаляем текущую страницу
			const prevPage = newHistory[newHistory.length - 1];
			if (fetcher && prevPage !== undefined) {
				fetch(prevPage, false);
			}
			return newHistory;
		})
	}, [fetch])

	const [expands, setExpands] = useState<TableNode<T>['index'][]>([])
	const toggleExpand = useCallback((index: TableNode<T>['index']) => {
		if (multiple) {
			setExpands((v) => {
				if (v.includes(index)) {
					return v.filter(v => v !== index)
				} else {
					return [...v, index]
				}
			})
		} else {
			setExpands(v => v[0] === index? []: [index])
		}
	}, [multiple])
	
	const handleModeChange = useCallback((item: TableNode<T>, column: ColumnEntity<T>) => {
		if (!editMode) {
			return
		}
		if (!column.editor) {
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
		return <Table layout="fixed" {...props}>
			{withHeader && <Table.Thead><TableHeader<T> columns={columns} /></Table.Thead>}
			<Table.Tbody><TableBody<T> nodes={nodes} columns={columns} level={level} /></Table.Tbody>
		</Table>
	}, [withHeader, breakpoint, columns, nodes, props])


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

	return (
		<TableDataProvider value={useMemo(() => ({
			props, sort, changeSort, breakpoint, editorMode, handleModeChange, clearModeChange, handleSaveItem, expands, toggleExpand, groupAt, colspan, rowspan,
		}), [props, sort, changeSort, breakpoint, editorMode, handleModeChange, clearModeChange, handleSaveItem, expands, toggleExpand, groupAt, colspan, rowspan,])}>
			<Stack mih={minHeight} gap='md'>
				<Loading active={loading} keepMounted mih={minHeight}>
					{render(nodes, columns)}
				</Loading>
				{!nodes?.length && <TableEmpty text={noDataText} />}
				{withPagination && <Pagination
					loading={isLoading}
					onNext={fetcher? handlerNext: undefined}
					onPprevious={fetcher? handlerPprevious: undefined}
					activePprevious={history?.length > 1}
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
			</Stack>
		</TableDataProvider>
	);
};


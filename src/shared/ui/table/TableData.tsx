import { useBreakpoint } from '@/shared/hooks';
import { Card, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { useMounted } from '@mantine/hooks';
import { Children, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loading } from '../loading';
import { TableDataProvider } from './context/TableDataContext';
import { useColumnHidden, useColumnOrder, useColumnSort, useNodeSelect } from './hooks';
import type {
	ColumnEntity,
	DataColumnProps,
	ExpandKind,
	TableDataProps,
	TableExpandablesState,
	TableExpandsState,
	TableNode,
	TableStorage,
	ToggleExpandOptions,
} from './type';
import { Table, TableBodyCellSlot, TableEmpty, TableHeaderCellSlot, TablePagination } from "./ui";
import { TableError } from './ui/TableError';
import { calculateColspan, calculateIsColumns, convertNodes, getColumnFields, groupByFirstKey, limitBy, purgeRemovedColumnStorage, sortByRules } from './utils';
import { canExpandGroupedNode, getNodeExpandKey, hasGroupNestedData } from './utils/group-by';

function genStorage(storageKey: string): TableStorage {
	const prefix = `${storageKey}.`;

	function keyStorage(key: string): string {
		return `${prefix}${key}`;
	}

	return {
		clear() {
			const keysToRemove: string[] = [];
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key?.startsWith(prefix)) {
					keysToRemove.push(key);
				}
			}
			for (const key of keysToRemove) {
				localStorage.removeItem(key);
			}
		},
		setItem(key, value) {
			localStorage.setItem(keyStorage(key), JSON.stringify(value));
		},
		getItem(key) {
			const value = localStorage.getItem(keyStorage(key));
			if (value) {
				return JSON.parse(value);
			}
			return value;
		},
		removeItem(key) {
			localStorage.removeItem(keyStorage(key));
		},
	};
}

export function TableData<T = object>({
	breakpoint: initialBreakpoint,
	storage: initialStorage,
	columns: initialColumns,
	multiple: initialMultiple,

	limits: initialLimits = [15, 30, 50, 75, 100],
	limit: initialLimit = initialLimits[0] || 15,
	page: initialPage = 1,

	columnOrder: initialColumnOrder,
	onColumnOrder: onInitialColumnOrder,

	hiddenColumns: initialHiddenColumns,
	onToggleColumn: onInitialHiddenColumns,

	columnWidths: initialColumnWidth,
	onColumnResize: onInitialColumnResize,

	selectable: initialSelectable,
	selectedRows: initialSelectedRows,
	onSelectedRowsChange: onInitialSelectedRowsChange,

	data: initialData,
	total: initialProps,
	loading: initialLoading,
	error: initialError = '',
	withHeader = true,
	withPagination = true,
	groupAt = 'start',
	groupKeys: initialGroupKeys,
	sortKey,
	sortDesc = false,
	multiSort: initialMultiSort,
	sortRules: initialSortRules,
	multiGroup: initialMultiGroup,

	////////

	children,
	layout: Layout = ({ nodes, columns }) => (
		<SimpleGrid cols={2}>
			{nodes.map((node) => (
				<Card key={node.index} withBorder>
					{columns
						.filter((column) => column.isField)
						.map((column) => (
							<Group
								key={column.field as string}
								align="flex-end"
								justify="space-between"
								grow
								style={{
									borderBottom: '1px dashed var(--mantine-color-default-border)',
								}}
							>
								<TableHeaderCellSlot<T> column={column} />
								<Text flex={0} fw={600}>
									<TableBodyCellSlot<T> node={node} column={column} />
								</Text>
							</Group>
						))}
				</Card>
			))}
		</SimpleGrid>
	),
	minHeight,
	pagination: Pagination = TablePagination,
	onRowEditComplete,
	editMode,
	noDataText = 'No records',
	level = 0,
	...other
}: TableDataProps<T>) {
	const selectColumn: ColumnEntity<T> = {
		field: '__select__' as keyof T,
		isSelecting: true,
		size: 1,
		level: 0,
		parentLevel: 0,
		columns: [],
		isDraggable: false,
		isGroup: false,
		isGrouped: false,
		isSorted: false,
		isColumns: false,
		isHeader: false,
		isField: false,
		isEmpty: true,
		isToggleable: false,
		isResizable: false,
		colspan: 1,
		width: 50,
		align: 'center',
	};
	const mounted = useMounted();
	const matchesBreakpoint = useBreakpoint(initialBreakpoint ?? 'xs');
	const breakpoint = !!initialBreakpoint && matchesBreakpoint;
	const fetcher = typeof initialData === 'function';
	const storage = useMemo<TableStorage | undefined>(() => {
		if (!initialStorage) {
			return undefined;
		}
		if (typeof initialStorage === 'string') {
			return genStorage(initialStorage);
		}
		return initialStorage;
	}, [initialStorage]);

	const props = useMemo(
		() => ({
			striped: true,
			highlightOnHover: true,
			horizontalSpacing: '0.5rem',
			verticalSpacing: '0.5rem',
			...other,
		}),
		[other],
	);
	const [limit, setLimit] = useState(initialLimit);
	const [page, setPage] = useState<number>(initialPage);
	const [next, setNext] = useState<string | number>('');
	const [history, setHistory] = useState<(string | number)[]>([]);

	const [data, setData] = useState<T[]>(Array.isArray(initialData) ? initialData : []);
	const [total, setTotal] = useState<number>(initialProps || data?.length);
	const [totalPage, setTotalPage] = useState(Math.ceil(total / limit));

	const [error, setError] = useState<React.ReactNode>(initialError);
	const [isLoading, setLoading] = useState<boolean>(false);
	const [expands, setExpands] = useState<TableExpandsState>({
		group: [],
		grouped: [],
	});

	const [editableMeta, setEditableMeta] = useState<{
		columns: ColumnEntity<T>['field'][];
		index: TableNode<T>['index'];
	}>({
		columns: [],
		index: 0,
	});

	const loading = useMemo<boolean>(
		() => initialLoading || isLoading,
		[initialLoading, isLoading],
	);

	const columnsRaw = useMemo<ColumnEntity<T>[]>(() => {
		if (initialColumns?.length) {
			return initialColumns;
		}

		function calculateColumn(column: DataColumnProps<T>, level = 0): ColumnEntity<T> {
			const col: ColumnEntity<T> = {
				size: 1,
				level: level + 1,
				parentLevel: level,
				columns: [],

				isDraggable: !!column.draggable,
				isGroup: !!column.group,
				isGrouped: !!column.grouped,

				isSelecting: false,
				isColumns: calculateIsColumns(column.children),
				isResizable: !!column.resizable,
				isHeader: !!column.header,
				isField: !!column.field,
				isEmpty: !column.field,
				isSorted: !!column.sortable,
				isToggleable: !!column.toggleable,
				colspan: calculateColspan(column.children) || column.size || 1,
				...column,
				children: undefined,
			};
			col.columns = Children.toArray(column.children).map((child: any) => {
				return calculateColumn(child.props, col.level);
			});
			return col;
		}

		const ret: ColumnEntity<T>[] = initialSelectable ? [selectColumn] : [];

		Children.forEach(children, (child: any) => {
			child?.props && ret.push(calculateColumn(child.props));
		});

		return ret;
	}, [initialColumns, children, initialSelectable]);

	const columnFields = useMemo(() => getColumnFields(columnsRaw), [columnsRaw]);

	const groupKeys = useMemo<(keyof T)[]>(() => {
		if (initialGroupKeys?.length) {
			return initialGroupKeys;
		}
		return columnsRaw
			.filter((column) => column.isGrouped && column.field)
			.map((column) => column.field as keyof T);
	}, [initialGroupKeys, columnsRaw]);

	const resolvedMultiSort = initialMultiSort ?? groupKeys.length > 1;
	const resolvedMultiGroup = initialMultiGroup ?? groupKeys.length > 1;

	const { sort, changeSort } = useColumnSort(
		columnsRaw,
		storage,
		sortKey,
		sortDesc,
		resolvedMultiSort,
		initialSortRules,
	);
	const { columnOrder, setColumnOrder, sortColumn } = useColumnOrder(
		columnsRaw,
		storage,
		initialColumnOrder,
		onInitialColumnOrder,
	);
	const { hiddenColumns, toggleColumn } = useColumnHidden(
		columnsRaw,
		storage,
		initialHiddenColumns,
		onInitialHiddenColumns,
	);



	const [internalWidths, setInternalWidths] = useState<Partial<Record<keyof T, number>>>(
		() => {
			if (initialColumnWidth) {
				return initialColumnWidth;
			}
			const widths: Partial<Record<keyof T, number>> = {};
			columnsRaw.forEach((column: ColumnEntity<T>) => {
				if (!column?.field) {
					return;
				}
				widths[column.field as keyof T] = (storage?.getItem(
					`columns.${String(column.field)}.width`,
				) || column.width) as number;
			});
			return widths;
		},
	);

	const columnWidths = initialColumnWidth ?? internalWidths;
	const setColumnWidths = initialColumnWidth ? () => {} : setInternalWidths;
	const resizeColumn = useCallback(
		(column: ColumnEntity<T>, width: number, nextWidth: number) => {
			if (!column?.field) {
				return;
			}
			setColumnWidths((prev) => {
				const next: Record<keyof T, number> = {
					...prev,
					[column.field as keyof T]: width,
				};
				if (nextWidth !== undefined && column.field) {
					const idx = columnOrder.indexOf(column.field as keyof T);
					const nextField = columnOrder[idx + 1];
					if (nextField) {
						next[nextField] = nextWidth;
					}
				}
				if (storage && !initialColumnWidth) {
					storage.setItem(`columns.${String(column.field)}.width`, width);
					if (nextWidth !== undefined) {
						const idx = columnOrder.indexOf(column.field as keyof T);
						const nextField = columnOrder[idx + 1];
						if (nextField)
							storage.setItem(`columns.${String(nextField)}.width`, nextWidth);
					}
				}
				return next;
			});
			onInitialColumnResize?.(column, width, nextWidth);
		},
		[columnOrder, storage, initialColumnWidth, onInitialColumnResize],
	);
	const getColumnWidth = useCallback(
		(column: ColumnEntity<T>) => {
			if (column.isGroup) {
				return 72;
			}
			return columnWidths[column.field as keyof T] || undefined;
		},
		[columnWidths],
	);

	const toggleExpand = useCallback(
		(
			expandKey: string | string[],
			kind: ExpandKind,
			options?: ToggleExpandOptions,
		) => {
			setExpands((prev) => {
				const updateKind = (current: string[]) => {
					if (Array.isArray(expandKey)) {
						if (options?.remove) {
							return current.filter((key) => !expandKey.includes(key));
						}
						if (options?.merge) {
							return [...new Set([...current, ...expandKey])];
						}
						return expandKey;
					}

					const allowMultiple = initialMultiple || resolvedMultiGroup;

					if (allowMultiple) {
						return current.includes(expandKey)
							? current.filter((key) => key !== expandKey)
							: [...current, expandKey];
					}
					return current.includes(expandKey) ? [] : [expandKey];
				};

				return {
					...prev,
					[kind]: updateKind(prev[kind]),
				};
			});
		},
		[initialMultiple, resolvedMultiGroup],
	);

	const isExpanded = useCallback(
		(expandKey: string, kind: ExpandKind) => expands[kind].includes(expandKey),
		[expands],
	);

	const render = useCallback<
		(
			nodes: TableNode<T>[],
			columns: ColumnEntity<T>[],
			visibleColumns: ColumnEntity<T>[],
		) => React.ReactNode
	>(
		(
			nodes: TableNode<T>[],
			columns: ColumnEntity<T>[],
			visibleColumns: ColumnEntity<T>[],
		) => {
			if (breakpoint && Layout) {
				return <Layout nodes={nodes} columns={visibleColumns} />;
			}
			return (
				<Table<T>
					withHeader={withHeader}
					nodes={nodes}
					columns={columns}
					visibleColumns={visibleColumns}
					level={level}
					{...props}
				/>
			);
		},
		[Layout, withHeader, breakpoint, props, level],
	);

	const columnFieldsKey = columnFields.join('|');
	const prevColumnFieldsKeyRef = useRef(columnFieldsKey);
	useEffect(() => {
		if (prevColumnFieldsKeyRef.current === columnFieldsKey) {
			return;
		}
		const prevFields = prevColumnFieldsKeyRef.current.split('|').filter(Boolean) as (keyof T)[];
		const removedFields = prevFields.filter((field) => !columnFields.includes(field));
		if (storage && removedFields.length && !initialColumnWidth) {
			purgeRemovedColumnStorage(storage, removedFields);
			setInternalWidths((prev) => {
				const next = { ...prev };
				for (const field of removedFields) {
					delete next[field];
				}
				return next;
			});
		}
		prevColumnFieldsKeyRef.current = columnFieldsKey;
	}, [columnFieldsKey, columnFields, storage, initialColumnWidth]);

	const columns = useMemo(() => {
		const grouped = columnsRaw.filter(
			(c) => (c.isGrouped || c.isGroup) && !c.isSelecting,
		);
		const selected = columnsRaw.filter((c) => c.isSelecting);
		const normal = columnsRaw.filter((c) => !c.isGrouped && !c.isGroup && !c.isSelecting);
		if (columnOrder?.length) {
			normal.sort(
				(a, b) =>
					columnOrder.indexOf(a.field as keyof T) -
					columnOrder.indexOf(b.field as keyof T),
			);
		}
		const columns = groupAt === 'start' ? [...grouped, ...normal] : [...normal, ...grouped];
		return initialSelectable === 'start'
			? [...selected, ...columns]
			: initialSelectable === 'end'
				? [...columns, ...selected]
				: columns;
	}, [columnsRaw, groupAt, initialSelectable, columnOrder]);

	const visibleColumns = useMemo(() => {
		if (!hiddenColumns.length) {
			return columns;
		}
		return columns.filter((col) => !hiddenColumns.includes(col.field as keyof T));
	}, [columns, hiddenColumns]);

	const rowspan = useMemo(() => {
		let max = 0;
		(function recursive(columns: ColumnEntity<T>[]) {
			for (const column of columns) {
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
		[columns],
	);

	const handleModeChange = useCallback(
		(node: TableNode<T>, column: ColumnEntity<T>) => {
			if (!editMode) {
				return;
			}
			if (!column.editor) {
				return;
			}
			if (editMode === 'row') {
				setEditableMeta({
					index: node.index,
					columns: columns.filter((v) => v.isField).map((v) => v.field),
				});
			} else if (editMode === 'cell') {
				setEditableMeta({
					index: node.index,
					columns: [column.field],
				});
			}
		},
		[editMode, columns],
	);
	const clearModeChange = useCallback(() => {
		setEditableMeta({
			index: 0,
			columns: [],
		});
	}, []);
	const editorMode = useCallback(
		(item: TableNode<T>, column: ColumnEntity<T>): boolean => {
			if (!editMode) {
				return false;
			}
			if (
				editableMeta.index === item.index &&
				editableMeta.columns.includes(column.field)
			) {
				return true;
			}
			return false;
		},
		[editMode, editableMeta],
	);

	const updateNode = useCallback(
		(index: TableNode<T>['index'], field: keyof T, value: T[keyof T]) => {
			setData((prevData) => {
				const idx = prevData.findIndex((_, i) => i.toString() === index.toString());
				if (idx === -1) {
					return prevData;
				}
				const newData = [...prevData];
				const item = newData[idx];
				if (!item) {
					return prevData;
				}
				newData[idx] = { ...item, [field]: value };
				return newData;
			});
		},
		[],
	);

	const commitEdit = useCallback(
		(index: TableNode<T>['index']) => {
			// Берём актуальный элемент из состояния data (не из node.data!)
			const idx = data.findIndex((_, i) => i.toString() === index.toString());
			const item = data[idx];
			if (item !== undefined) {
				onRowEditComplete?.(item, index);
			}
			clearModeChange(); // выходим из режима редактирования
		},
		[data, clearModeChange, onRowEditComplete],
	);

	const fetch = useCallback(
		(page: string | number = '', saveHistory = true) => {
			if (!mounted || typeof initialData !== 'function') {
				return;
			}
			setLoading(true);
			initialData({ limit, page })
				.then(({ data, next, total, pages }) => {
					setData(data);
					setNext(next);
					if (total) {
						setTotal(total);
					}
					if (pages) {
						setTotalPage(pages);
					}
					setLoading(false);
					saveHistory && setHistory((v) => [...v, page]);
				})
				.catch((error: IError) => {
					setError(
						error.response?.data?.detail || error?.message || 'Ошибка загрузки данных!',
					);
					setLoading(false);
				});
		},
		[initialData, limit, mounted],
	);

	const nodes: TableNode<T>[] = useMemo<TableNode<T>[]>(() => {
		let nextNodes: TableNode<T>[] = convertNodes(data);
		if (groupKeys.length) {
			nextNodes = groupByFirstKey<T>(nextNodes, groupKeys);
		}

		if (!fetcher && limit > 0) {
			nextNodes = limitBy(nextNodes, limit, page);
		}
		if (sort.rules.length) {
			nextNodes = sortByRules(nextNodes, sort.rules);
		}
		return nextNodes;
	}, [data, sort.rules, groupKeys, limit, page, fetcher]);

	useEffect(() => {
		if (initialProps !== undefined) {
			setTotal(initialProps);
			return;
		}
		setTotal(data.length);
	}, [initialProps, data.length]);

	const expandables = useMemo<TableExpandablesState>(() => {
		const groupColumn = columns.find((col) => col.isGroup);

		const group =
			groupColumn
				? nodes
						.filter((node) => hasGroupNestedData(node, groupColumn))
						.map((node) => getNodeExpandKey(node))
				: [];

		const groupedByLevel: Partial<Record<number, string[]>> = {};
		if (groupKeys.length) {
			groupedByLevel[0] = nodes
				.filter((node) => canExpandGroupedNode(node, groupKeys))
				.map((node) => getNodeExpandKey(node));
		}

		return { group, groupedByLevel };
	}, [nodes, columns, groupKeys]);

	const handlerNext = function () {
		if (fetcher) {
			fetch(next, true);
		}
	};
	const handlerPprevious = useCallback(
		function () {
			setHistory((prev) => {
				const newHistory = [...prev];
				newHistory.pop(); // удаляем текущую страницу
				const prevPage = newHistory[newHistory.length - 1];
				if (fetcher && prevPage !== undefined) {
					fetch(prevPage, false);
				}
				return newHistory;
			});
		},
		[fetcher, fetch],
	);

	useEffect(() => {
		if (!fetcher) {
			return;
		}
		setHistory([]);
		fetch(page);
	}, [fetch, page, fetcher]);

	useEffect(() => {
		setLimit(initialLimit);
		setPage(initialPage);
	}, [initialPage, initialLimit]);

	useEffect(() => {
		setData(Array.isArray(initialData) ? initialData : []);
	}, [initialData]);

	useEffect(() => {
		setTotalPage(Math.ceil(total / limit));
	}, [total, limit]);

	const { selectedRows, toggleRow, selectAll, isRowSelected, someSelected, allSelected } =
		useNodeSelect(nodes, storage, initialSelectedRows, onInitialSelectedRowsChange);

	return (
		<TableDataProvider
			value={useMemo(
				() => ({
					selectedRows,
					toggleRow,
					selectAll,
					isRowSelected,
					someSelected,
					allSelected,

					columnWidths,
					resizeColumn,
					getColumnWidth,

					columnOrder,
					onColumnOrder: setColumnOrder,
					sortColumn,

					hiddenColumns,
					toggleColumn,

					props,
					sort,
					changeSort,
					multiSort: resolvedMultiSort,
					multiGroup: resolvedMultiGroup,
					groupKeys,
					groupLevel: 0,
					breakpoint,
					editorMode,
					handleModeChange,
					clearModeChange,
					commitEdit,
					expands,
					isExpanded,
					toggleExpand,
					groupAt,
					colspan,
					rowspan,

					editMode,

					expandables,
					updateNode,
					storage,
				}),
				[
					selectedRows,
					toggleRow,
					selectAll,
					isRowSelected,
					someSelected,
					allSelected,
					hiddenColumns,
					toggleColumn,
					props,
					sort,
					changeSort,
					resolvedMultiSort,
					resolvedMultiGroup,
					groupKeys,
					breakpoint,
					editorMode,
					handleModeChange,
					clearModeChange,
					commitEdit,
					expands,
					isExpanded,
					toggleExpand,
					groupAt,
					colspan,
					rowspan,
					resizeColumn,
					getColumnWidth,
					editMode,
					sortColumn,
					setColumnOrder,
					columnOrder,
					expandables,
					updateNode,
					storage,
					columnWidths,
				],
			)}
		>
			<Stack mih={minHeight} gap="md">
				<Loading active={loading} keepMounted mih={minHeight}>
					{error && <TableError>{error}</TableError>}
					{!error &&
						(nodes.length
							? render(nodes, columns, visibleColumns)
							: <TableEmpty text={noDataText} />)}
				</Loading>
				{withPagination && (
					<Pagination
						loading={loading}
						onNext={fetcher ? handlerNext : undefined}
						onPprevious={fetcher ? handlerPprevious : undefined}
						activePprevious={history?.length > 1}
						activeNext={!!next}
						page={page}
						total={totalPage}
						limit={limit}
						limits={initialLimits}
						onChangePage={setPage}
						onChangeLimit={(val) => {
							setPage(1);
							setLimit(val);
						}}
					/>
				)}
			</Stack>
		</TableDataProvider>
	);
};


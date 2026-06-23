import { useBreakpoint } from '@/shared/hooks';
import { Card, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { useMounted } from '@mantine/hooks';
import { Children, useCallback, useEffect, useMemo, useState } from "react";
import { Loading } from '../loading';
import { TableDataProvider } from './context/TableDataContext';
import { useColumnHidden, useColumnOrder, useColumnSort, useNodeSelect } from './hooks';
import type { ColumnEntity, DataColumnProps, TableDataProps, TableNode, TableStorage } from './type';
import { Table, TableBodyCellSlot, TableEmpty, TableHeaderCellSlot, TablePagination } from "./ui";
import { TableError } from './ui/TableError';
import { calculateColspan, calculateIsColumns, convertNodes, groupBy, limitBy, sortBy } from './utils';

function genStorage(storageKey: string): TableStorage {
	function keyStorage(key: string): string {
		return `${storageKey}.${key}`;
	}
	return {
		clear() {},
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
	sortKey,
	sortDesc = false,

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
	const breakpoint = !!initialBreakpoint && useBreakpoint(initialBreakpoint);
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
	const [expands, setExpands] = useState<TableNode<T>['index'][]>([]);

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

		const ret: ColumnEntity<T>[] = [selectColumn];

		Children.forEach(children, (child: any) => {
			child?.props && ret.push(calculateColumn(child.props));
		});

		return ret;
	}, [initialColumns, children]);

	const fields = useMemo(() => columnsRaw.map((column) => column.field), [columnsRaw]);

	const { sort, changeSort } = useColumnSort(columnsRaw, storage, sortKey, sortDesc)
	const { columnOrder, setColumnOrder, sortColumn, setInternalColumnOrder } =
		useColumnOrder(columnsRaw, storage, initialColumnOrder, onInitialColumnOrder);
	const { hiddenColumns, toggleColumn, setInternalHiddenColumns } = useColumnHidden(
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
		(index: TableNode<T>['index'] | TableNode<T>['index'][]) => {
			if (initialMultiple) {
				if (Array.isArray(index)) {
					setExpands(index);
				} else {
					setExpands((v) => {
						if (v.includes(index)) {
							return v.filter((v) => v !== index);
						} else {
							return [...v, index];
						}
					});
				}
			} else {
				setExpands((v) => (v[0] === index?.[0] || index ? [] : [index?.[0] || index]));
			}
		},
		[initialMultiple],
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

	useEffect(() => {
		setInternalColumnOrder((prev) => {
			const newColumnOrder = [...new Set(prev).intersection(new Set(fields))];
			setColumnOrder(newColumnOrder);
			return newColumnOrder;
		});
		if (storage) {
			setInternalHiddenColumns((prev) => {
				const newHidden = [...new Set(prev).intersection(new Set(fields))];
				storage?.setItem('columns.hidden', newHidden);
				return newHidden as (keyof T)[];
			});
		}
	}, [storage, columnsRaw]);

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

	const groupKey = useMemo<ColumnEntity<T>['field'] | undefined>(() => {
		for (const column of columns) {
			if (column.isGrouped) {
				return column.field;
			}
		}
		return undefined;
	}, [columns]);

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
				newData[idx] = { ...newData[idx], [field]: value };
				return newData;
			});
		},
		[],
	);

	const commitEdit = useCallback(
		(index: TableNode<T>['index']) => {
			// Берём актуальный элемент из состояния data (не из node.data!)
			const idx = data.findIndex((_, i) => i.toString() === index.toString());
			if (idx !== -1) {
				onRowEditComplete?.(data[idx], index);
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
		let nodes: TableNode<T>[] = convertNodes(data);
		if (groupKey) {
			nodes = groupBy<T>(nodes, groupKey as keyof T);
		}

		setTotal(initialProps || nodes?.length);

		if (!fetcher && limit > 0) {
			nodes = limitBy(nodes, limit, page);
		}
		if (sort.key) {
			nodes = sortBy(nodes, sort.key, sort.descending);
		}
		return nodes;
	}, [data, sort, groupKey, limit, page, initialProps, fetcher]);

	const expandables = useMemo<TableNode<T>['index'][]>(() => {
		const column = columns.find((col) => col.isGroup);
		if (!column || !column.field) {
			return [];
		}
		return nodes
			.filter((node) => node?.data?.[column.field as keyof T]?.length)
			.map((node) => node.index);
	}, [nodes, columns]);
	//

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
		setHistory([]);
		fetch(page);
	}, [fetch, page]);

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
		<TableDataProvider<T>
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
					breakpoint,
					editorMode,
					handleModeChange,
					clearModeChange,
					commitEdit,
					expands,
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
					hiddenColumns,
					toggleColumn,
					props,
					sort,
					changeSort,
					breakpoint,
					editorMode,
					handleModeChange,
					clearModeChange,
					commitEdit,
					expands,
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
					{render(nodes, columns, visibleColumns)}
					{error && <TableError>{error}</TableError>}
					{!error && !nodes?.length && <TableEmpty text={noDataText} />}
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


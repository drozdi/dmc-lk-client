import { keys } from "@mantine/core";
import {
	DataTable as MantineDataTable,
	useDataTableColumns,
	type DataTableProps,
	type DataTableSortStatus,
} from "mantine-datatable";
import { useMemo, useState } from "react";

function filterData<T>(data: T[], search: string): T[] {
	const query = search.toLowerCase().trim();
	return (data || []).filter((item) =>
		keys(data?.[0] || {}).some((key) =>
			String(item[key]).toLowerCase().includes(query),
		),
	);
}

// declare function DataTable<T>({
// 	onSelectedRecordsChange,
// 	onSortStatusChange,
// 	onPageChange,
// 	onRecordsPerPageChange,
// 	onRowClick,
// 	onRowDoubleClick,
// 	onRowContextMenu,
// 	onCellClick,
// 	onCellDoubleClick,
// 	onCellContextMenu,
// 	onScroll,
// 	onScrollToTop,
// 	onScrollToBottom,
// 	onScrollToLeft,
// 	onScrollToRight,
// 	}: DataTableProps<T>): react.JSX.Element;

function sortData<T>(
	data: T[],
	payload: { sortBy: keyof T | null; reversed: boolean; search: string },
): T[] {
	const { sortBy } = payload;

	if (!sortBy) {
		return filterData(data, payload.search);
	}

	return filterData(
		[...data].sort((a, b) => {
			if (payload.reversed) {
				return String(b[sortBy]).localeCompare(String(a[sortBy]));
			}

			return String(a[sortBy]).localeCompare(String(b[sortBy]));
		}),
		payload.search,
	);
}

export function DataTable<T = Record<string, any>>({
	className,
	columns,
	records = [],
	...props
}: DataTableProps<T>) {
	const key = "draggable-example";
	const [sortStatus, setSortStatus] = useState<DataTableSortStatus<T>>({
		columnAccessor: "",
		direction: "asc",
		sortKey: "",
	});
	const sortedData = useMemo<T[]>(
		() =>
			sortData<T>(records, {
				sortBy: sortStatus.sortKey as keyof T,
				reversed: sortStatus.direction === "desc",
				search: "",
			}),
		[records, sortStatus],
	);

	const { effectiveColumns } = useDataTableColumns<T>({
		key,
		columns: columns,
	});

	return (
		<MantineDataTable<T>
			className={className}
			minHeight={300}
			columns={effectiveColumns}
			storeColumnsKey={key}
			{...props}
			records={sortedData}
			sortStatus={sortStatus}
			onSortStatusChange={setSortStatus}
		/>
	);
}

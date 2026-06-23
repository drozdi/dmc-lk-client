import { useTableDataContext } from "../context";
import { type TablePaginationProps } from "../ui";

export function usePagination<T = object>(): TablePaginationProps<T> {
	const ctx = useTableDataContext<T>();
	return ctx.pagination;
}
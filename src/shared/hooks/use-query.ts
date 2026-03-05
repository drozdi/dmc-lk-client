import { useMemo } from "react";

export function useQueryLoading(...queries: (IQuery | IStore)[]): boolean {
	return useMemo<boolean>(
		() => queries.some((query) => query.isLoading),
		[queries.map((query) => query.isLoading)],
	);
}
export function useQueryError(...queries: (IQuery | IStore)[]): IError {
	return useMemo<IError>(
		() =>
			queries.reduce((acc: IError, query: IQuery) => acc || query.error, ""),
		[queries.map((query) => query.error)],
	);
}
export function useQueryFetching(...queries: (IQuery | IStore)[]): boolean {
	return useMemo<boolean>(
		() => queries.some((query) => query.isFetching),
		[queries.map((query) => query.isFetching)],
	);
}

export function useQueryPending(...queries: (IQuery | IStore)[]): boolean {
	return useMemo<boolean>(
		() => queries.some((query) => query.isPending),
		[queries.map((query) => query.isPending)],
	);
}

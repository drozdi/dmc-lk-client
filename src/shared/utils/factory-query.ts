import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useCallback } from "react";

export function factoryQuery<
	T extends { id?: number; name?: string },
	RL extends IRequestList,
>(
	entry: string,
	defaultEntry: T,
	requestList: (params: Omit<RL, "number">) => Promise<IResponseList<T>>,
	requestRead: (id: T["id"]) => Promise<IResponse<T>>,
	requestCreate: (data: T) => Promise<IResponse<T>>,
	requestUpdate: (id: T["id"], data: T) => Promise<IResponse<T>>,
	requestDelete?: (id: T["id"] | T["id"][]) => Promise<IResponse<string>>,
) {
	return [
		requestList &&
			function useQueryList(params: Omit<RL, "number">) {
				params.size = params.size || 100;
				const q = useInfiniteQuery({
					queryKey: [entry, { ...params, number: undefined }],
					initialPageParam: 0,
					queryFn: async ({ pageParam }) => {
						const res = await requestList({
							...params,
							number: pageParam,
						});
						if (!res.success) {
							throw new Error(
								res.message ||
									"Список запросов: подумать над ошибкой!",
							);
						}
						return res;
					},
					getNextPageParam: (lastPage) => {
						if (
							lastPage.data.response.length >= lastPage.data.size
						) {
							return lastPage.data.next_page - 1;
						}
					},
					getPreviousPageParam: (...args) => {},
					select({ pages, pageParams }): T[] {
						return pages[pageParams[pageParams.length - 1]].data
							.response;
					},
				});
				const findById = useCallback(
					(id: T["id"]) =>
						(q.data || []).find((item) => item.id === id),
					[q.data],
				);
				return {
					...q,
					findById,
				};
			},
		requestRead &&
			function useQueryRead(id: T["id"]) {
				return useQuery({
					queryKey: [entry, id],
					queryFn: async () =>
						id ? await requestRead(id) : { data: defaultEntry },
					select(data): T {
						return data.data;
					},
				});
			},
		requestCreate &&
			function useQueryCreate() {
				const queryClient = useQueryClient();
				return useMutation({
					mutationFn: async (data: T | Partial<T>) => {
						return await requestCreate(data);
					},
					onSuccess: (data, {}) => {
						queryClient.invalidateQueries({ queryKey: [entry] });
					},
				});
			},
		requestUpdate &&
			function useQueryUpdate() {
				const queryClient = useQueryClient();
				return useMutation({
					mutationFn: async ({ id, ...data }: T | Partial<T>) => {
						return await requestUpdate(id, data as T);
					},
					onSuccess: (data, {}) => {
						queryClient.invalidateQueries({ queryKey: [entry] });
					},
				});
			},
		requestDelete &&
			function useQueryDelete() {
				const queryClient = useQueryClient();
				return useMutation({
					mutationFn: async ({ id }: T | Partial<T>) => {
						return await requestDelete(id);
					},
					onSuccess: (data, {}) => {
						queryClient.invalidateQueries({ queryKey: [entry] });
					},
				});
			},
	];
}

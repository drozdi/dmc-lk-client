import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useState } from "react";

export function factoryQuery<
	T extends { id?: number },
	RL extends IRequestList,
>(
	entry: string,
	defaultEntry: T,
	requestList?: (params: Partial<RL>) => Promise<IResponseList<T>>,
	requestRead?: (id: T["id"]) => Promise<IResponse<T>>,
	requestCreate?: (data: T | Partial<T>) => Promise<IResponse<T>>,
	requestUpdate?: (id: T["id"], data: T | Partial<T>) => Promise<IResponse<T>>,
	requestDelete?: (id: T["id"]) => Promise<IResponse<string>>,
) {
	return [
		requestList &&
			function useQueryList(params: Partial<RL>) {
				params.size = params.size || 15;
				const q = useInfiniteQuery({
					queryKey: [entry, "infinite"],
					initialPageParam: 0,
					queryFn: async ({ pageParam }) => {
						const res = await requestList({
							...params,
							number: pageParam,
						});
						if (!res.success) {
							throw new Error(
								res.message || "Список запросов: подумать над ошибкой!",
							);
						}
						return res;
					},
					getNextPageParam: (lastPage) => {
						return lastPage.data.response &&
							lastPage.data.response.length >= (params.size || 15)
							? lastPage.data.next_page - 1
							: undefined;
					},
					getPreviousPageParam: (firstPage) => {
						return firstPage.data.page > 1
							? firstPage.data.previous_page - 1
							: undefined;
					},
					// select({ pages, pageParams }): T[] {
					// 	return pages[pageParams[pageParams.length - 1]].data.response;
					// },
				});

				const [currentPageIndex, setCurrentPageIndex] = useState(0);

				const goToPrevious = async () => {
					if (currentPageIndex > 0) {
						setCurrentPageIndex((prev) => prev - 1);
					} else if (q.hasPreviousPage) {
						await q.fetchPreviousPage();
					}
				};

				// Обработчик "Следующая"
				const goToNext = async () => {
					const lastIndex = (q.data?.pages.length ?? 1) - 1;
					if (currentPageIndex < lastIndex) {
						setCurrentPageIndex((prev) => prev + 1);
					} else if (q.hasNextPage) {
						// Иначе загружаем следующую страницу
						await q.fetchNextPage();
						setCurrentPageIndex((prev) => prev + 1);
					}
				};

				const findById = useCallback(
					(id: T["id"]) =>
						(q.data?.pages[currentPageIndex]?.data.response || []).find(
							(item) => item.id === id,
						),
					[q.data, currentPageIndex],
				);

				return {
					...q,
					findById,
					goToNext,
					goToPrevious,
					hasPreviousPage: currentPageIndex > 0,
					hasNextPage:
						q.hasNextPage ||
						currentPageIndex === ((q.data?.pages || []).length ?? 1) - 1,
					data: q.data?.pages[currentPageIndex]?.data.response || [],
				};
			},
		requestRead &&
			function useQueryRead(id: T["id"]) {
				return useQuery({
					queryKey: [entry, id],
					queryFn: async () => await requestRead(id),
					select(data): T {
						return data.data;
					},
					placeholderData: { data: defaultEntry },
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
						queryClient.removeQueries({
							queryKey: [entry],
							exact: false,
						});
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
					onSuccess: (data, params) => {
						queryClient.invalidateQueries({
							queryKey: [entry],
							exact: false,
						});
						queryClient.setQueryData([entry, params.id], data.data);
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
					onSuccess: (data, params) => {
						queryClient.removeQueries({
							queryKey: [entry],
							exact: false,
						});
					},
				});
			},
	];
}

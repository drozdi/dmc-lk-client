import { useInfiniteQuery } from "@tanstack/react-query";
import { requestAnalyticsQueriesList } from "../../api/query_users";

export function useQueryQueryList(params: Omit<IRequestList, "number">) {
	params.size = params.size || 100;
	return useInfiniteQuery({
		queryKey: ["query_users", { ...params, number: undefined }],
		initialPageParam: 0,
		queryFn: async ({ pageParam }) => {
			const res = await requestAnalyticsQueriesList({
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
		getNextPageParam: (lastPage) => lastPage.next_page,
		getPreviousPageParam: (lastPage) => lastPage.previous_page,
		select({ pages }): IAnalyticsElastic[] {
			return pages[0].data.response;
		},
	});
}

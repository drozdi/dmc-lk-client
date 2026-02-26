import { useInfiniteQuery } from "@tanstack/react-query";
import { requestUsersList } from "../api/users";

export function useQueryUsersList(params: Omit<IRequestList, "number">) {
	params.size = params.size || 15;
	return useInfiniteQuery({
		queryKey: ["users", { ...params, number: undefined }],
		initialPageParam: 0,
		queryFn: async ({ pageParam }) => {
			const res = await requestUsersList({
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
		select({ pages }): IUsersUser[] {
			return pages[0].data.response;
		},
	});
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestAnalyticsQueriesAdd } from "../../api/query_users";

export function useQueryQueryCreate() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (
			data: Omit<IAnalyticsElastic, "id">,
		): Promise<IAnalyticsElastic> => {
			return (await requestAnalyticsQueriesAdd(data)).data;
		},
		onSuccess: (res, data) => {
			queryClient.removeQueries({
				queryKey: ["query_users"],
				exact: false,
			});
			queryClient.setQueryData(["query_users", { id: res.id }], res);
		},
	});
}

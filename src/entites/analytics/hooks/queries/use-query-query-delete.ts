import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestAnalyticsQueriesDelete } from "../../api/query_users";

export function useQueryQueryDelete() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id }: IAnalyticsElastic) => {
			return await requestAnalyticsQueriesDelete(id);
		},
		onSuccess: () => {
			queryClient.removeQueries({ queryKey: ["query_users"] });
		},
	});
}

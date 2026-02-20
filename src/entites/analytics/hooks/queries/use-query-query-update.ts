import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestAnalyticsQueriesUpdate } from "../../api/query_users";

export function useQueryQueryUpdate() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (
			data: Partial<IAnalyticsElastic>,
		): Promise<IAnalyticsElastic> => {
			return (await requestAnalyticsQueriesUpdate(data)).data;
		},
		onSuccess: (res, data) => {
			queryClient.refetchQueries({ queryKey: ["query_users"] });
			queryClient.setQueryData(["query_users", { id: data.id }], res);
		},
	});
}

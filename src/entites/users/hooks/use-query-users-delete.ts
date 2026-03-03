import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestUsersDelete } from "../api/users";

export function useQueryUsersDelete() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id }: IAnalyticsElastic) => {
			return await requestUsersDelete(id);
		},
		onSuccess: () => {
			queryClient.removeQueries({
				queryKey: ["users"],
				exact: false,
			});
		},
	});
}

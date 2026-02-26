import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestUsersUpdate } from "../api/users";

export function useQueryUsersUpdate() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["users"],
		mutationFn: async ({ id, ...data }: IUsersUser) =>
			await requestUsersUpdate(id, data),
		onSuccess: ({ data }, ...args) => {
			queryClient.refetchQueries({
				queryKey: ["users"],
			});
			queryClient.setQueryData(["users", data.id], data);
		},
	});
}

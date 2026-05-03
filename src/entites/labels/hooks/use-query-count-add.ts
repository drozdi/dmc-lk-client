import { useMutation, useQueryClient } from "@tanstack/react-query"
import { requestLabelsCountAdd } from "../api/count_label"

export function useQueryCountAdd() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async (data: IRequestCountLabelAdd) => await reques, usetLabelsCountAdd(data),
		onSuccess: (...args) => {
			console.log(...args)
		}
	})
};
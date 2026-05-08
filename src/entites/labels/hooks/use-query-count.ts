import { useQuery } from "@tanstack/react-query";
import { requestLabelsCount } from "../api/count_label";

export function useQueryCount() {
	return useQuery({
		queryKey: ["labels-count"],
		initialData: {
			distributed: [],
			not_distributed: [],
		},
		queryFn: async () => {
			const response = await requestLabelsCount();
			return response.data;
		},
	})
}
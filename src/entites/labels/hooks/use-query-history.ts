import { useQuery } from "@tanstack/react-query";

export function useQueryHistory() {
	return useQuery({
		queryKey: ["labels-count"],
		initialData: {
			distributed: [],
			not_distributed: [],
		},
		queryFn: async () => {
			const params = {
				size: 100,
				number: 0,
			};
			let history: ICountLabelHistoryItem[] = [];
			let res;
			do {
				res = (await requestLabelsHistory(params)).data?.response || [];
				history = [...history, ...res];
				params.number++;
			} while (res.length >= params.size);
			return history;
		},
	})
}
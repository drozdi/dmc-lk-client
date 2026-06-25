import { useQuery } from "@tanstack/react-query";
import { requestLabelsHistory } from "../api/count_label";

export function useQueryHistory(filterdate: string[] = []) {
	return useQuery({
		queryKey: ["labels-history", filterdate],
		queryFn: async () => {
			const params = {
				size: 100,
				number: 0,
				filterdate,
			};
			let history: ICountLabelHistoryItem[] = [];
			let res: ICountLabelHistoryItem[] = [];

			do {
				res = (await requestLabelsHistory(params)).data?.response || [];
				history = [...history, ...res];
				params.number++;
			} while (res.length === params.size);

			return history;
		},
	});
}

import { useQuery } from "@tanstack/react-query";
import { requestAnalyticsQueriesGet } from "../../api/query_users";

export function useQueryQueryRead(id: IAnalyticsElastic["id"]) {
	return useQuery({
		queryKey: ["query_users", Number(id)],
		queryFn: async () => {
			return await requestAnalyticsQueriesGet(id);
		},
		select(data): IAnalyticsElastic {
			return data.data;
		},
	});
}

import { queryClient } from "@/shared/api/query-client";
import { useState } from "react";
import { requestAnalytics } from "../api/analytics";

export function useQueryAnalytics(params: Partial<IRequestAnalytics> = {}) {
	const [data, setData] = useState<IResponseAnalytics>({
		id: 0,
		sum_company: 0,
		production: [],
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<IError>("");

	return {
		data,
		isLoading,
		error,
		fetch: async (
			query: Partial<IRequestAnalytics> = {},
		): Promise<IResponseAnalytics | undefined> => {
			const _query = {
				...params,
				filterdate: [
					params.filterdate_from ||
						params.filterdate?.[0] ||
						query.filterdate_from ||
						query.filterdate?.[0],
					params.filterdate_to ||
						params.filterdate?.[1] ||
						query.filterdate_to ||
						query.filterdate?.[1] ||
						"",
				],
				...query,
			} as IRequestAnalytics;

			setIsLoading(true);
			try {
				const res = await queryClient.fetchQuery({
					queryKey: ["analytics", JSON.stringify(_query)],
					queryFn: async (): Promise<IResponseAnalytics> =>
						(await requestAnalytics(_query)).data,
				});
				setData(res);
				setIsLoading(false);
				return res;
			} catch (e: IError) {
				console.error(e);
				const error =
					e?.response?.data?.detail || e?.message || e || "Неизвестная ошибка";
				setError(error);
				setIsLoading(false);
			}
			return undefined;
		},
	};
}

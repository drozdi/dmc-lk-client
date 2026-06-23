import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { requestAnalytics } from "../api/analytics";
import {
	ANALYTICS_QUERY_GC_TIME,
	ANALYTICS_QUERY_STALE_TIME,
} from "../constants";
import {
	getAnalyticsQueryKey,
	normalizeAnalyticsParams,
	serializeAnalyticsParamsKey,
} from "../utils/analytics-query";

const DEFAULT_DATA: IResponseAnalytics = {
	id: 0,
	all_records: 0,
	sum_company: 0,
	min_company: 0,
	max_company: 0,
	average_company: 0,
	sum_consumption_m: 0,
	min_consumption_m: 0,
	max_consumption_m: 0,
	average_consumption_m: 0,
	production: [],
};

function useNormalizedAnalyticsParams(
	baseParams: Partial<IRequestAnalytics>,
) {
	const paramsKey = serializeAnalyticsParamsKey(baseParams);

	return useMemo(
		() => normalizeAnalyticsParams(baseParams),
		[paramsKey],
	);
}

export function useQueryAnalytics(baseParams: Partial<IRequestAnalytics> = {}) {
	const queryClient = useQueryClient();
	const params = useNormalizedAnalyticsParams(baseParams);
	const queryKey = getAnalyticsQueryKey(params);

	const {
		data = DEFAULT_DATA,
		isLoading,
		isFetching,
		error: queryError,
		refetch,
	} = useQuery({
		queryKey,
		queryFn: async () =>
			requestAnalytics(params!).then((res) => res.data),
		enabled: !!params,
		staleTime: ANALYTICS_QUERY_STALE_TIME,
		gcTime: ANALYTICS_QUERY_GC_TIME,
		retry: false,
	});

	const error = queryError
		? (queryError as any)?.response?.data?.detail ||
			(queryError as Error)?.message ||
			"Неизвестная ошибка"
		: "";

	const fetch = useCallback(
		async (
			query: Partial<IRequestAnalytics> = {},
		): Promise<IResponseAnalytics | undefined> => {
			const mergedParams = normalizeAnalyticsParams({
				...baseParams,
				...query,
				filterdate: [
					query.filterdate?.[0] ?? baseParams.filterdate?.[0] ?? null,
					query.filterdate?.[1] ?? baseParams.filterdate?.[1] ?? null,
				],
				step: query.step ?? baseParams.step,
				event: query.event ?? baseParams.event,
				production_id: query.production_id ?? baseParams.production_id,
				place_id: query.place_id ?? baseParams.place_id,
			});

			if (!mergedParams) {
				return DEFAULT_DATA;
			}

			const mergedKey = getAnalyticsQueryKey(mergedParams);

			if (mergedKey.join("|") === queryKey.join("|")) {
				const result = await refetch();
				return result.data;
			}

			return queryClient.fetchQuery({
				queryKey: mergedKey,
				queryFn: async () =>
					requestAnalytics(mergedParams).then((res) => res.data),
				staleTime: ANALYTICS_QUERY_STALE_TIME,
				gcTime: ANALYTICS_QUERY_GC_TIME,
			});
		},
		[baseParams, queryClient, queryKey, refetch],
	);

	return {
		data,
		isLoading: isLoading || isFetching,
		isFetching,
		error,
		fetch,
		refetch,
		isReady: !!params,
	};
}

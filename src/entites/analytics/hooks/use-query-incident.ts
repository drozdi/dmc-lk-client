import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { requestAnalyticsIncident } from "../api/incident";
import {
	ANALYTICS_QUERY_GC_TIME,
	ANALYTICS_QUERY_STALE_TIME,
} from "../constants";
import {
	getIncidentQueryKey,
	normalizeIncidentParams,
	serializeIncidentParamsKey,
} from "../utils/incident-query";

const DEFAULT_DATA: IAnalyticsIncidentItem[] = [];

function useNormalizedIncidentParams(
	baseParams: Partial<IRequestAnalyticsIncident>,
) {
	const paramsKey = serializeIncidentParamsKey(baseParams);

	return useMemo(
		() => normalizeIncidentParams(baseParams),
		[paramsKey],
	);
}

export function useQueryIncident(
	baseParams: Partial<IRequestAnalyticsIncident> = {},
) {
	const queryClient = useQueryClient();
	const params = useNormalizedIncidentParams(baseParams);
	const queryKey = getIncidentQueryKey(params);

	const {
		data = DEFAULT_DATA,
		isLoading,
		isFetching,
		error: queryError,
		refetch,
	} = useQuery({
		queryKey,
		queryFn: async () =>
			requestAnalyticsIncident(params!).then((res) => res.data),
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
			query: Partial<IRequestAnalyticsIncident> = {},
		): Promise<IAnalyticsIncidentItem[] | undefined> => {
			const mergedParams = normalizeIncidentParams({
				...baseParams,
				...query,
				filterdate: [
					query.filterdate?.[0] ?? baseParams.filterdate?.[0] ?? null,
					query.filterdate?.[1] ?? baseParams.filterdate?.[1] ?? null,
				],
				data: query.data ?? baseParams.data,
				fields_name: query.fields_name ?? baseParams.fields_name,
			});

			if (!mergedParams) {
				return DEFAULT_DATA;
			}

			const mergedKey = getIncidentQueryKey(mergedParams);

			if (mergedKey.join("|") === queryKey.join("|")) {
				const result = await refetch();
				return result.data;
			}

			return queryClient.fetchQuery({
				queryKey: mergedKey,
				queryFn: async () =>
					await requestAnalyticsIncident(mergedParams).then((res) => res.data),
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

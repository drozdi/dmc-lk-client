import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { requestAnalytics } from "../api/analytics";
import {
	ANALYTICS_QUERY_GC_TIME,
	ANALYTICS_QUERY_STALE_TIME,
} from "../constants";
import {
	getAnalyticsQueryKey,
	isAnalyticsBaseQueryReady,
} from "../utils/analytics-query";
import { corectQuery } from "../utils/query";

export function useFetchAnalyticsEvents(
	baseQuery: Partial<IRequestAnalytics>,
	events: AnalyticEvent[],
) {
	const query = useMemo(
		() => corectQuery(baseQuery as IRequestAnalytics),
		[
			baseQuery.filterdate?.[0],
			baseQuery.filterdate?.[1],
			baseQuery.step,
			baseQuery.production_id,
			baseQuery.event,
		],
	);

	const enabled = isAnalyticsBaseQueryReady(query) && events.length > 0;

	const results = useQueries({
		queries: events.map((event) => ({
			queryKey: getAnalyticsQueryKey({ ...query, event }),
			queryFn: async () =>
				requestAnalytics({ ...query, event }).then((res) => res.data),
			enabled,
			staleTime: ANALYTICS_QUERY_STALE_TIME,
			gcTime: ANALYTICS_QUERY_GC_TIME,
		})),
	});

	const data = useMemo(() => {
		const merged: Partial<Record<AnalyticEvent, IResponseAnalytics>> = {};
		events.forEach((event, index) => {
			if (results[index]?.data) {
				merged[event] = results[index].data;
			}
		});
		return merged;
	}, [events, results]);

	const isLoading = results.some((result) => result.isLoading);
	const isFetching = results.some((result) => result.isFetching);

	return {
		data,
		isLoading,
		isFetching,
		query,
		setQuery: () => {},
	};
}

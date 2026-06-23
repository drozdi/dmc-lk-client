import type { QueryClient } from "@tanstack/react-query";
import { requestAnalytics } from "../api/analytics";
import {
	ANALYTICS_QUERY_GC_TIME,
	ANALYTICS_QUERY_STALE_TIME,
} from "../constants";

export function isAnalyticsQueryReady(
	params: Partial<IRequestAnalytics>,
): boolean {
	const productionId = params.production_id;

	return !!(
		params.filterdate?.[0] &&
		params.filterdate?.[1] &&
		params.step &&
		productionId &&
		(Array.isArray(productionId) ? productionId.length : true)
	);
}

export async function fetchAnalyticsEvents(
	queryClient: QueryClient,
	query: IRequestAnalytics,
	events: AnalyticEvent[],
): Promise<Partial<Record<AnalyticEvent, IResponseAnalytics>>> {
	const entries = await Promise.all(
		events.map(async (event) => {
			const mergedParams = { ...query, event };

			const data = await queryClient.fetchQuery({
				queryKey: ["analytics", mergedParams],
				queryFn: async () =>
					requestAnalytics(mergedParams).then((res) => res.data),
				staleTime: ANALYTICS_QUERY_STALE_TIME,
				gcTime: ANALYTICS_QUERY_GC_TIME,
			});

			return [event, data] as const;
		}),
	);

	return Object.fromEntries(entries);
}

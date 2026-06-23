import type { QueryClient } from "@tanstack/react-query";
import { requestAnalytics } from "../api/analytics";
import {
	ANALYTICS_QUERY_GC_TIME,
	ANALYTICS_QUERY_STALE_TIME,
} from "../constants";
import { corectQuery } from "./query";

export function isAnalyticsBaseQueryReady(
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

export function isAnalyticsQueryReady(
	params: Partial<IRequestAnalytics>,
): boolean {
	return isAnalyticsBaseQueryReady(params) && !!params.event;
}

export function normalizeAnalyticsParams(
	params: Partial<IRequestAnalytics> = {},
): IRequestAnalytics | null {
	const corrected = corectQuery({
		filterdate: params.filterdate ?? [null, null],
		step: params.step ?? "d",
		event: params.event ?? "p",
		production_id: params.production_id ?? [],
		place_id: params.place_id,
	} as IRequestAnalytics);

	if (!isAnalyticsQueryReady(corrected)) {
		return null;
	}

	return corrected;
}

export function getAnalyticsQueryKey(
	params: IRequestAnalytics | null,
): readonly unknown[] {
	if (!params) {
		return ["analytics", "idle"] as const;
	}

	const productionId = Array.isArray(params.production_id)
		? params.production_id
		: [params.production_id];

	const placeId = params.place_id
		? Array.isArray(params.place_id)
			? params.place_id
			: [params.place_id]
		: [];

	return [
		"analytics",
		params.filterdate[0],
		params.filterdate[1],
		params.step,
		params.event,
		...productionId.map(String),
		...placeId.map(String),
	] as const;
}

export function serializeAnalyticsParamsKey(
	params: Partial<IRequestAnalytics> = {},
): string {
	return getAnalyticsQueryKey(normalizeAnalyticsParams(params)).join("|");
}

export async function fetchAnalyticsEvents(
	queryClient: QueryClient,
	query: IRequestAnalytics,
	events: AnalyticEvent[],
): Promise<Partial<Record<AnalyticEvent, IResponseAnalytics>>> {
	const entries = await Promise.all(
		events.map(async (event) => {
			const mergedParams = { ...query, event };
			const queryKey = getAnalyticsQueryKey(mergedParams);

			const data = await queryClient.fetchQuery({
				queryKey,
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

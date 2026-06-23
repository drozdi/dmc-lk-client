import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
	fetchAnalyticsEvents,
	isAnalyticsBaseQueryReady,
} from "../utils/analytics-query";
import { corectQuery } from "../utils/query";

export function useFetchAnalyticsEvents(
	baseQuery: Partial<IRequestAnalytics>,
	events: AnalyticEvent[],
) {
	const queryClient = useQueryClient();
	const [query, setQuery] = useState<IRequestAnalytics>(() =>
		corectQuery(baseQuery as IRequestAnalytics),
	);
	const [data, setData] = useState<
		Partial<Record<AnalyticEvent, IResponseAnalytics>>
	>({});
	const [isLoading, setIsLoading] = useState(false);

	const eventsKey = useMemo(() => events.join(","), [events]);

	useEffect(() => {
		setQuery((current) =>
			corectQuery({
				...current,
				...baseQuery,
			} as IRequestAnalytics),
		);
	}, [
		baseQuery.filterdate?.[0],
		baseQuery.filterdate?.[1],
		baseQuery.step,
		baseQuery.production_id,
		baseQuery.event,
	]);

	useEffect(() => {
		if (!isAnalyticsBaseQueryReady(query) || !events.length) {
			return;
		}

		let cancelled = false;
		setIsLoading(true);

		fetchAnalyticsEvents(queryClient, query, events)
			.then((result) => {
				if (!cancelled) {
					setData(result);
				}
			})
			.finally(() => {
				if (!cancelled) {
					setIsLoading(false);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [query, eventsKey, queryClient, events]);

	return {
		data,
		isLoading,
		isFetching: isLoading,
		query,
		setQuery,
	};
}

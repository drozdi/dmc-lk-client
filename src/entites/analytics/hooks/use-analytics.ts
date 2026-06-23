import { useQueryAnalytics } from "@/entites/analytics";
import { isAnalyticsQueryReady } from "@/entites/analytics/utils/analytics-query";
import { deepEqual } from "@/shared/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { corectQuery } from "../utils";

export function useAnalytics(
	initialState: Partial<IRequestAnalytics>,
	onChange?: (state: IRequestAnalytics) => void,
) {
	const [query, setQuery] = useState<IRequestAnalytics>(() =>
		corectQuery(initialState as IRequestAnalytics),
	);
	const oldQuery = useRef<IRequestAnalytics>(query);
	const res = useQueryAnalytics(query);

	const reset = useCallback(() => {
		setQuery((v) => corectQuery({ ...v, ...initialState }));
	}, [initialState]);

	const fetch = useCallback((nextQuery: Partial<IRequestAnalytics>) => {
		setQuery((v) =>
			corectQuery({
				...v,
				...nextQuery,
			}),
		);
	}, []);

	useEffect(() => {
		setQuery((v) =>
			corectQuery({
				...v,
				...initialState,
			} as IRequestAnalytics),
		);
	}, [
		initialState.filterdate?.[0],
		initialState.filterdate?.[1],
		initialState.step,
		initialState.event,
		initialState.production_id,
	]);

	useEffect(() => {
		if (!isAnalyticsQueryReady(query)) {
			return;
		}

		res.fetch(query);

		if (!deepEqual(query, oldQuery.current)) {
			oldQuery.current = query;
			onChange?.(query);
		}
	}, [query]);

	return {
		...res,
		query,
		fetch,
		reset,
	};
}

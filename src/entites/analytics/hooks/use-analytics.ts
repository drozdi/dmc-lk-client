import { useQueryAnalytics } from "@/entites/analytics";
import { deepEqual } from "@/shared/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { corectQuery } from "../utils";

export function useAnalytics(
	initialState: Partial<IRequestAnalytics>,
	onChange?: (state: IRequestAnalytics) => void,
) {
	const [query, setQuery] = useState<IRequestAnalytics>(
		corectQuery(initialState as IRequestAnalytics),
	);
	const oldQuery = useRef<IRequestAnalytics>(query);

	const res = useQueryAnalytics(query);

	const reset = useCallback(() => {
		setQuery((v) => corectQuery({ ...v, ...initialState }));
	}, []);

	const fetch = useCallback((query: Partial<IRequestAnalytics>) => {
		setQuery((v) =>
			corectQuery({
				...v,
				...query,
			}),
		);
	}, []);

	useEffect(() => {
		res.fetch();
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

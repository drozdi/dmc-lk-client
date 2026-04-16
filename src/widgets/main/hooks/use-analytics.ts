import { useQueryAnalytics } from "@/entites/analytics";
import { useCallback, useEffect, useState } from "react";

export function useAnalytics(init: IRequestAnalytics) {
	const [query, setQuery] = useState<IRequestAnalytics>(init);

	const data = useQueryAnalytics(query);

	const reset = useCallback(() => {
		setQuery(init);
	}, []);

	const fetch = useCallback((query: Partial<IRequestAnalytics>) => {
		setQuery((v) => ({
			...v,
			...query,
		}));
	}, []);

	useEffect(() => {
		data.fetch();
	}, [query]);

	return {
		...data,
		query,
		fetch,
		reset,
	};
}

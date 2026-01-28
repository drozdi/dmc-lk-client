import { useMemo } from "react";
import { useStoreLabels } from "../use-store-labels";

export function usePrints(production_id?: number | string) {
	const storeLabels = useStoreLabels();
	return useMemo(() => {
		if (production_id) {
			return storeLabels.prints[String(production_id)] || [];
		} else {
			return storeLabels.prints || [];
		}
	}, [storeLabels.prints, production_id]);
}

import { useMemo } from "react";
import { useStoreLabels } from "../use-store-labels";

export function useFormatPrints(production_id?: ILabel["production_id"]) {
	const storeLabels = useStoreLabels();
	return useMemo(() => {
		if (production_id) {
			return storeLabels.selectFormatPrints(production_id) || [];
		} else {
			return storeLabels.formatPrints || [];
		}
	}, [storeLabels.formatPrints, production_id]);
}

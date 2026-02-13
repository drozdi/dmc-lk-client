import { useMemo } from "react";
import { useStoreLabels } from "../use-store-labels";

export function useFormats(production_id?: ILabel["production_id"]) {
	const storeLabels = useStoreLabels();
	return useMemo(() => {
		if (production_id) {
			return storeLabels.selectFormats(production_id) || [];
		} else {
			return storeLabels.formats || [];
		}
	}, [storeLabels.formats, production_id]);
}

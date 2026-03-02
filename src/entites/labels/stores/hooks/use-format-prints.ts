import { useMemo } from "react";
import { useStoreLabels } from "../use-store-labels";

export function useFormatPrints(): Record<ILabel["production_id"], ILabel[]>;
export function useFormatPrints(
	production_id: ILabel["production_id"],
): ILabel[];
export function useFormatPrints(
	production_id?: ILabel["production_id"],
): Record<ILabel["production_id"], ILabel[]> | ILabel[] {
	const storeLabels = useStoreLabels();
	return useMemo(() => {
		if (production_id) {
			return storeLabels.selectFormatPrints(production_id) || [];
		} else {
			return storeLabels.formatPrints || [];
		}
	}, [storeLabels.formatPrints, production_id]);
}

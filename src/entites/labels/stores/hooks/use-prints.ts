import { useMemo } from "react";
import { useStoreLabels } from "../use-store-labels";

export function usePrints(): Record<
	ILabel["production_id"],
	ILabel["statistics_print_format"][]
>;
export function usePrints(
	production_id: ILabel["production_id"],
): ILabel["statistics_print_format"][];
export function usePrints(
	production_id?: ILabel["production_id"],
):
	| Record<ILabel["production_id"], ILabel["statistics_print_format"][]>
	| ILabel["statistics_print_format"][] {
	const storeLabels = useStoreLabels();
	return useMemo(() => {
		if (production_id) {
			return storeLabels.selectPrints(production_id) || [];
		} else {
			return storeLabels.prints || [];
		}
	}, [storeLabels.prints, production_id]);
}

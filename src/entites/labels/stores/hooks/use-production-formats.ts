import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { useStoreLabels } from "../use-store-labels";

export function useProductionFormats(): Record<
	ILabel["production_id"],
	ILabel[]
>;
export function useProductionFormats(
	production_id: ILabel["production_id"],
): ILabel[];

export function useProductionFormats(
	production_id: ILabel["production_id"] = 0
) {
	production_id = Number(production_id) || 0
		
	const storeLabels = useStoreLabels(useShallow(state => ({
		formats: state.formats,
		loadFormats: state.loadFormats,
		selectFormats: state.selectFormats,
	})));
	
	useEffect(() => {
		storeLabels.loadFormats()	
	}, [])
	
	return useMemo(() => 
		production_id
		? storeLabels.selectFormats(production_id)
		: (storeLabels.formats || {})
	, [storeLabels.formats, production_id])
}

import { useCallback } from "react";
import { useProductionFormats } from "./use-production-formats";

export function useProductionFormatsCode(
	production_id: ILabel["production_id"] = 0
) {
	production_id = Number(production_id) || 0
	const res = useProductionFormats(production_id);
	return useCallback<(name: ILabel['add_label_format']) => ILabel['statistics_print_format']>((name) => res?.find((item) => item.add_label_format === name)?.statistics_print_format || name, [res])
}

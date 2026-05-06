import { useCallback } from "react";
import { useProductionFormats } from "./use-production-formats";

export function useProductionFormatsLabel(
	production_id: ILabel["production_id"] = 0
) {
	production_id = Number(production_id) || 0
	const res = useProductionFormats(production_id);
	return useCallback<(name: string) => string>((name: string) => name === '.default'? "Без группы": res?.find((item) => item.statistics_print_format === name)?.add_label_format || name, [res])
}

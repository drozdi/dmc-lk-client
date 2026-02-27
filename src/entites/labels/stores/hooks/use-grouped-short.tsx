import { useMemo } from "react";
import { useGrouped } from "./use-grouped";

type Grouped = Record<
	ILabel["add_label_format"],
	ILabel["statistics_print_format"][]
>;

export function useGroupedShort(production_id?: ILabel["production_id"]) {
	const formatPrints = useGrouped();
	const res = useMemo<Record<IProduction["production_id"], Grouped>>(() => {
		const res: Record<IProduction["production_id"], Grouped> = {};
		for (let prod in formatPrints) {
			res[prod] = res[prod] || {};
			for (let format in formatPrints[prod]) {
				res[prod][format] = formatPrints[prod][format].map(
					(item) => item.print,
				);
			}
		}

		return res;
	}, [formatPrints]);

	return useMemo<
		Record<IProduction["production_id"], Grouped> | Grouped
	>(() => {
		if (production_id) {
			return res[production_id] || [];
		} else {
			return res || {};
		}
	}, [res, production_id]);
}

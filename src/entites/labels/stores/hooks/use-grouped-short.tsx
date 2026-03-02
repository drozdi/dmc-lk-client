import { useMemo } from "react";
import { useGrouped } from "./use-grouped";

type GroupedShort = Record<
	ILabel["add_label_format"],
	ILabel["statistics_print_format"][]
>;

export function useGroupedShort(): Record<
	ILabel["production_id"],
	GroupedShort
>;
export function useGroupedShort(
	production_id: ILabel["production_id"],
): GroupedShort;
export function useGroupedShort(production_id?: ILabel["production_id"]) {
	const formatPrints = useGrouped();
	const res = useMemo<
		Record<IProduction["production_id"], GroupedShort>
	>(() => {
		const res: Record<IProduction["production_id"], GroupedShort> = {};
		for (let prod in formatPrints) {
			const prodData = formatPrints[prod];
			if (!prodData) {
				continue;
			}
			res[prod] = res[prod] || {};
			for (let format in prodData) {
				res[prod][format] =
					prodData[format]?.map((item) => item.print) || [];
			}
		}

		return res;
	}, [formatPrints]);

	return useMemo<
		Record<IProduction["production_id"], GroupedShort> | GroupedShort
	>(() => {
		if (production_id) {
			return res[production_id] || {};
		} else {
			return res || {};
		}
	}, [res, production_id]);
}

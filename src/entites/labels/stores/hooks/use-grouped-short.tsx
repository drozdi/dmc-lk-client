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
	const res: Record<IProduction["production_id"], GroupedShort> = {};
	for (const prod in formatPrints) {
		const prodData = formatPrints[prod];
		if (!prodData) {
			continue;
		}
		res[prod] = res[prod] || {};
		for (const format in prodData) {
			res[prod][format] =
				prodData[format]?.map((item) => item.print) || [];
		}
	}

	return production_id ? res[production_id] || {} : res || {};
}

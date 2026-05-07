import { useEffect, useMemo } from 'react';
import { selectFormatForProduction, selectPrintsForProduction, selectSelectFormatPrintsForProduction, useStoreLabels } from "../use-store-labels";

type Grouped = Record<
	ILabel["add_label_format"] | ".default",
	{
		_id?: ILabel["id"];
		id: ILabel["statistics_print_format"];
		format: ILabel["add_label_format"] | ".default";
		print: ILabel["statistics_print_format"];
	}[]
>;

function grouped(production_id: ILabel["production_id"]): Grouped {
	production_id = Number(production_id) || 0;
	const prints = selectPrintsForProduction(production_id)(useStoreLabels.getState());
	const formats = selectFormatForProduction(production_id)(useStoreLabels.getState());
	const formatPrints = selectSelectFormatPrintsForProduction(production_id)(useStoreLabels.getState())
	
	const containers: Grouped =
		Object.fromEntries((formats || []).map((item) => [item.add_label_format, []])) || {};

	containers[".default"] = (prints || []).map((item) => ({
		id: item,
		_id: undefined,
		format: ".default",
		print: item,
		add_label_format: ".default",
		statistics_print_format: item,
	}));

	formatPrints.forEach((item) => {
		if (item.add_label_format) {
			containers[item.add_label_format]?.push({
				...item,
				id: item.statistics_print_format,
				_id: item.id,
				format: item.add_label_format,
				print: item.statistics_print_format,
			});
		}
		const i =
			containers[".default"]?.findIndex((e) => e.statistics_print_format === item.statistics_print_format);

		if (i > -1) {
			containers[".default"]?.splice(i, 1);
		}
	});
	return containers;
}

export function useGrouped(): Record<ILabel["production_id"], Grouped>;
export function useGrouped(production_id: ILabel["production_id"]): Grouped;
export function useGrouped(
	production_id?: ILabel["production_id"],
): Record<ILabel["production_id"], Grouped> | Grouped {
	production_id = Number(production_id) || 0;
	const storeLabels = useStoreLabels();

	const res = useMemo(() => {
		let productions: ILabel["production_id"][] = [];
		productions = productions.concat(Object.keys(storeLabels.formats));
		productions = productions.concat(Object.keys(storeLabels.prints));
		productions = [...new Set(productions)];
		return Object.fromEntries(
			productions.map((production_id) => {
				return [production_id, grouped(production_id)];
			}),
	)}, [storeLabels.prints, storeLabels.formats, storeLabels.formatPrints]);

	useEffect(() => {
		storeLabels.load()
	}, [])

	return useMemo(() => production_id ? res[production_id] || {} : res || {}
	, [production_id, res]);
}

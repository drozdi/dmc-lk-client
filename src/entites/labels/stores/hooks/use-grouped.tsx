import { useMemo } from "react";
import { useStoreLabels } from "../use-store-labels";

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
	const prints = useStoreLabels.getState().selectPrints(production_id);
	const formats = useStoreLabels.getState().selectFormats(production_id);
	const formatPrints = useStoreLabels
		.getState()
		.selectFormatPrints(production_id);

	const containers: Grouped =
		Object.fromEntries((formats || []).map((item) => [item, []])) || {};

	containers[".default"] = (prints || []).map((item) => ({
		id: item,
		_id: undefined,
		format: ".default",
		print: item,
	}));

	formatPrints.forEach((item) => {
		item.format &&
			containers[item.format]?.push({
				id: item.statistics_print_format,
				_id: item.id,
				format: item.add_label_format,
				print: item.statistics_print_format,
			});
		const i =
			containers[".default"]?.findIndex((e) => e.print === item.print) ||
			-1;
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
	const storeLabels = useStoreLabels();

	const res = useMemo<Record<ILabel["production_id"], Grouped>>(() => {
		let productions: ILabel["production_id"][] = [];
		productions = productions.concat(Object.keys(storeLabels.formats));
		productions = productions.concat(Object.keys(storeLabels.prints));
		productions = [...new Set(productions)];

		return Object.fromEntries(
			productions.map((production_id) => {
				return [production_id, grouped(production_id)];
			}),
		);
	}, [storeLabels.prints, storeLabels.formats, storeLabels.formatPrints]);

	return useMemo<Record<ILabel["production_id"], Grouped> | Grouped>(() => {
		if (production_id) {
			return res[production_id] || {};
		} else {
			return res || {};
		}
	}, [res, production_id]);
}

import { useMemo } from "react";
import { useStoreLabels } from "../use-store-labels";

export function useFormatPrints(production_id?: number | string) {
	const storeLabels = useStoreLabels();

	const res = useMemo(() => {
		let productions: string[] = [];
		productions = productions.concat(Object.keys(storeLabels.formatPrints));
		productions = productions.concat(Object.keys(storeLabels.formats));
		productions = productions.concat(Object.keys(storeLabels.prints));
		productions = [...new Set(productions)];

		return Object.fromEntries(
			productions.map((production_id) => {
				const formatPrints =
					storeLabels.formatPrints[String(production_id)] || [];
				const formats =
					storeLabels.formats[String(production_id)] || [];
				const prints = storeLabels.prints[String(production_id)] || [];

				const con: Record<string, string[]> =
					Object.fromEntries(formats.map((item) => [item, []])) || {};

				con[".default"] = prints || [];

				formatPrints.forEach((item) => {
					if (item.format) {
						con[item.format]?.push(item.statistics_print_format);
					}

					const i = con[".default"]?.findIndex(
						(print) => print === item.statistics_print_format,
					);
					if (i !== -1) {
						con[".default"]?.splice(i as number, 1);
					}
				});

				return [String(production_id), con];
			}),
		);
	}, [storeLabels.formatPrints, storeLabels.formats, storeLabels.prints]);

	return useMemo(() => {
		if (production_id) {
			return res[String(production_id)] || [];
		} else {
			return res || {};
		}
	}, [res, production_id]);
}

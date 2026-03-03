import { useMemo } from "react";
import { useStoreCountLabel } from "../use-store-count-label";
import { useGroupedShort } from "./use-grouped-short";

type Grouped = any;

export function useConsumptions(): Record<ILabel["production_id"], Grouped>;
export function useConsumptions(
	production_id: ILabel["production_id"],
): Grouped;
export function useConsumptions(
	production_id?: ILabel["production_id"],
): Record<ILabel["production_id"], Grouped> | Grouped {
	const storeCountLabel = useStoreCountLabel();
	const formatPrints = useGroupedShort();

	const ddata = useMemo<Record<ILabel["production_id"], Grouped>>(() => {
		const res: any = {};

		for (const history of storeCountLabel.history) {
			res[history.production_id] = res[history.production_id] || {
				production_id: history.production_id,
				labels: {},
			};

			for (const format in formatPrints[history.production_id]) {
				if (
					formatPrints[history.production_id][format].includes(
						history.format_template,
					)
				) {
					if (format === ".default") {
						res[history.production_id].labels[
							history.format_template
						] =
							(res[history.production_id].labels[
								history.format_template
							] || 0) + (history.consumption_m || 0);
					} else {
						res[history.production_id].labels[format] =
							(res[history.production_id].labels[format] || 0) +
							(history.consumption_m || 0);
					}

					break;
				}
			}
		}
		//return res;
		return Object.fromEntries(
			Object.entries(res).map(([production_id, data]) => [
				production_id,
				{
					...data,
					labels: Object.entries(data.labels).map(
						([label, consumption_m]) => ({
							label,
							consumption_m,
						}),
					),
				},
			]),
		);
	}, [storeCountLabel.history, formatPrints]);

	return useMemo(() => {
		if (production_id) {
			return ddata[production_id] || {};
		} else {
			return ddata;
		}
	}, [ddata, production_id]);
}

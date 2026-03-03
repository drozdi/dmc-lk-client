import { useStoreLabels } from "../use-store-labels";

export function useFormatPrints(): Record<ILabel["production_id"], ILabel[]>;
export function useFormatPrints(
	production_id: ILabel["production_id"],
): ILabel[];
export function useFormatPrints(
	production_id?: ILabel["production_id"],
): Record<ILabel["production_id"], ILabel[]> | ILabel[] {
	const storeLabels = useStoreLabels();
	return production_id
		? storeLabels.selectFormatPrints(production_id) || []
		: storeLabels.formatPrints || [];
}

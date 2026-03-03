import { useStoreLabels } from "../use-store-labels";

export function useFormats(): Record<
	ILabel["production_id"],
	ILabel["add_label_format"][]
>;
export function useFormats(
	production_id: ILabel["production_id"],
): ILabel["add_label_format"][];
export function useFormats(
	production_id?: ILabel["production_id"],
):
	| Record<ILabel["production_id"], ILabel["add_label_format"][]>
	| ILabel["add_label_format"][] {
	const storeLabels = useStoreLabels();
	return production_id
		? storeLabels.selectFormats(production_id) || []
		: storeLabels.formats || [];
}

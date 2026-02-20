import { useStoreCountLabel } from "../use-store-count-label";
import { useStoreLabels } from "../use-store-labels";
import { useGrouped } from './use-grouped';

export function useConsumptions (production_id?: ILabel["production_id"]) {
	const storeLabels = useStoreLabels();
	const storeCountLabel = useStoreCountLabel();
	const grouped = useGrouped()
	
}
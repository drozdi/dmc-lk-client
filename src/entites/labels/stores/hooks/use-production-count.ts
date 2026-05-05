import { useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/shallow';
import { useStoreCountLabel } from '../use-store-count-label';

export function useProductionCount (): Record<ICountLabelItem['production_id'], {
	distributed: ICountLabelItem[],
	not_distributed: ICountLabelItem[],
}>
export function useProductionCount (production_id: ICountLabelHistoryItem['production_id']): {
	distributed: ICountLabelItem[],
	not_distributed: ICountLabelItem[],
}

export function useProductionCount (
	production_id: ICountLabelHistoryItem['production_id'] = 0
) {
	const storeCountLabel = useStoreCountLabel(useShallow((state) => ({
			loadCount: state.loadCount,
			count: state.count,
		})))
	
	useEffect(() => {
		storeCountLabel.loadCount()
	}, [])

	const res = useMemo(() => {
		const res: Record<ICountLabelItem['production_id'], {
			distributed: ICountLabelItem[],
			not_distributed: ICountLabelItem[],
		}> = {}
    Object.entries(storeCountLabel.count).forEach(([type, collection]) => {
			for (const item of collection) {
				res[item.production_id] = res[item.production_id] || {
					distributed: [],
					not_distributed: [],
				}
				if (item.production_id) {
					res[item.production_id][type as 'distributed' | 'not_distributed'].push(item)
				}
			}
		})
		return res
	}, [storeCountLabel.count])

	return useMemo(() => {
		production_id = Number(production_id) || 0
		if (production_id > 0) {
			return res[production_id] || {
					distributed: [],
					not_distributed: [],
				}
		}
		return res
	}, [production_id, res])
}
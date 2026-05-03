import { useStoreCountLabel } '../use-store-count-label';
import { useShallow } from 'zustand/shallow';
import { useMemo } from 'react'

export function useProductionCount (
	production_id: ICountLabelHistoryItem['production_id'] = 0
) {
	const storeCountLabel = useStoreCountLabel(useShallow((state) => ({
			loadCount: state.loadCount,
			count: state.count,
		})))
	
	const res = useMemo(() => {
		const res = {}
    Object.entries( storeCountLabel.count).forEach(([type, collection]) => {
			for (const item of collection) {
				res[item.production_id] = res[item.production_id] || {}
				res[item.production_id][type] = res[item.production_id][type] || []
				res[item.production_id][type].push(item)
			}
		})
		return res
	}, [storeCountLabel.count])

	return useMemo(() => {
		production_id = Number(production_id) || 0
		if (production_id > 0) {
			return res[production_id]
		}
		return res
	}, [production_id, res])
}
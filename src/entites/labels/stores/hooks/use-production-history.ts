import { useStoreCountLabel } '../use-store-count-label';
import { useShallow } from 'zustand/shallow';
import { useMemo } from 'react'

export function useProductionHistory (
	production_id: ICountLabelHistoryItem['production_id'] = 0
) {
	const storeCountLabel = useStoreCountLabel(useShallow((state) => ({
			loadHistory: state.loadHistory,
			history: state.history,
		})))

	const res = useMemo(() => {
		const res = {}
		for (const item of storeCountLabel.history) {
			res[item.production_id] = res[item.production_id] || []
			res[item.production_id].push(item)
		}
		return res
	}, [storeCountLabel.history])

	return useMemo(() => {
		production_id = Number(production_id) || 0
		if (production_id > 0) {
			return res[production_id]
		}
		return res
	}, [production_id, res])
}
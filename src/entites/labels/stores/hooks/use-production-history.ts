import { useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/shallow';
import { useStoreCountLabel } from '../use-store-count-label';

export function useProductionHistory(): Record<ICountLabelHistoryItem['production_id'], ICountLabelHistoryItem[]>
export function useProductionHistory(production_id: ICountLabelHistoryItem['production_id']): ICountLabelHistoryItem[]

export function useProductionHistory (
	production_id: ICountLabelHistoryItem['production_id'] = 0
) {
	const storeCountLabel = useStoreCountLabel(useShallow((state) => ({
			loadHistory: state.loadHistory,
			history: state.history,
		})))

	useEffect(() => {
		storeCountLabel.loadHistory()
	}, [])

	const res = useMemo(() => {
		const res: Record<ICountLabelHistoryItem['production_id'], ICountLabelHistoryItem[]> = {}
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
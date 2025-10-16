import { useMemo } from 'react'
import { countLabelStore } from '../count-label-store'

export function useHistories(production_id?: integer | string) {
	return useMemo(() => {
		if (production_id) {
			return countLabelStore.history[production_id] || []
		} else {
			return countLabelStore.history || []
		}
	}, [countLabelStore.history, production_id])
}

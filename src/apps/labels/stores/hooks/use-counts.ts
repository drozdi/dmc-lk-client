import { useMemo } from 'react'
import { countLabelStore } from '../count-label-store'

export function useCounts(production_id?: integer | string) {
	return useMemo(() => {
		if (production_id) {
			return {
				distributed: countLabelStore.count.distributed.filter(
					item => String(item.production_id) === String(production_id)
				),
				not_distributed: countLabelStore.count.not_distributed.filter(
					item => String(item.production_id) === String(production_id)
				),
			}
		} else {
			return countLabelStore.count || []
		}
	}, [countLabelStore.count, production_id])
}

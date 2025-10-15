import { useMemo } from 'react'
import { labelsStore } from '../labels-store'

export function usePrints(production_id?: integer | string) {
	return useMemo(() => {
		if (production_id) {
			return labelsStore.prints[production_id] || []
		} else {
			return labelsStore.prints || []
		}
	}, [labelsStore.prints, production_id])
}

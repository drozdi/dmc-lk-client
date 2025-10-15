import { useMemo } from 'react'
import { labelsStore } from '../labels-store'

export function useFormats(production_id?: integer | string) {
	return useMemo(() => {
		if (production_id) {
			return labelsStore.formats[production_id] || []
		} else {
			return labelsStore.formats || []
		}
	}, [labelsStore.formats, production_id])
}

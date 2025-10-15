import { useMemo } from 'react'
import { labelsStore } from '../labels-store'

export function useFormatPrints(production_id?: integer | string) {
	const res = useMemo(() => {
		let productions: string[] = []
		productions = productions.concat(Object.keys(labelsStore.formatPrints))
		productions = productions.concat(Object.keys(labelsStore.formats))
		productions = productions.concat(Object.keys(labelsStore.prints))
		productions = [...new Set(productions)]

		return Object.fromEntries(
			productions.map(production_id => {
				const formatPrints = labelsStore.formatPrints[production_id] || []
				const formats = labelsStore.formats[production_id] || []
				const prints = labelsStore.prints[production_id] || []

				const con = Object.fromEntries(formats.map(item => [item, []])) || {}

				con['.default'] = prints || []

				formatPrints.forEach(item => {
					item.format && con[item.format]?.push(item.print)

					const i = con['.default'].findIndex(e => e === item.print)
					if (i !== -1) {
						con['.default'].splice(i, 1)
					}
				})

				return [production_id, con]
			})
		)
	}, [labelsStore.formatPrints, labelsStore.formats, labelsStore.prints])
	return useMemo(() => {
		if (production_id) {
			return res[production_id] || []
		} else {
			return res || []
		}
	}, [res, production_id])
}

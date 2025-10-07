import { useMemo } from 'react'
import { formatPrintStore } from '../../stores/format-print-store'
import { formatStore } from '../../stores/format-store'
import { printStore } from '../../stores/print-store'
export function useLabelFormat(production_id?: integer | string) {
	const res = useMemo(() => {
		let productions: string[] = []
		productions = productions.concat(Object.keys(formatPrintStore.formatPrints))
		productions = productions.concat(Object.keys(formatStore.formats))
		productions = productions.concat(Object.keys(printStore.prints))
		productions = [...new Set(productions)]

		return Object.fromEntries(
			productions.map(production_id => {
				const formatPrints = formatPrintStore.formatPrints[production_id] || []
				const formats = formatStore.formats[production_id] || []
				const prints = printStore.prints[production_id] || []

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
	}, [formatPrintStore.formatPrints, formatStore.formats, printStore.prints])
	return useMemo(() => {
		if (production_id) {
			return res[production_id]
		} else {
			return res
		}
	}, [res, production_id])
}

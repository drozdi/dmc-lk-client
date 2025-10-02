import { formatPrintStore } from '../../stores/format-print-store'
import { formatStore } from '../../stores/format-store'
import { printStore } from '../../stores/print-store'
export function useLabelFormat() {
	let productions = []
	productions = productions.concat(Object.keys(formatPrintStore.formatPrints))
	productions = productions.concat(Object.keys(formatStore.formats))
	productions = productions.concat(Object.keys(printStore.prints))
	productions = [...new Set(productions)]
	const res = productions.map(production_id => {
		const formatPrints = formatPrintStore.formatPrints[production_id] || []
		const formats = formatStore.formats[production_id] || []
		const prints = printStore.prints[production_id] || []

		const con = Object.fromEntries(formats.map(item => [item, []])) || {}

		con['.default'] = (prints || []).map(item => ({
			print: item,
			id: item,
			format: '.default',
			_id: undefined,
		}))
		formatPrints.forEach(item => {
			item.format &&
				con[item.format]?.push({
					format: item.format,
					print: item.print,
				})
			const i = con['.default'].findIndex(e => e.print === item.print)
			if (i !== -1) {
				con['.default'].splice(i, 1)
			}
		})

		return [production_id, con]
	})

	console.log(Object.entries(res))

	// Object.fromEntries(formatPrintStore.formatPrints).forEach((production_id, key) => {}
	// console.log(JSON.parse(JSON.stringify(formatPrintStore.formatPrints)))
	// console.log(JSON.parse(JSON.stringify(formatStore.formats)))
	// console.log(JSON.parse(JSON.stringify(printStore.prints)))
}

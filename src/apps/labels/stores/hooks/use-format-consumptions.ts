import { useMemo } from 'react'
import { useProduction } from '../../../../stores/hooks/use-production'
import { useConsumptions } from './use-consumptions'
import { useFormatPrints } from './use-format-prints'

export function useFormatСonsumptions(production_id?: integer | string) {
	const consumptions = useConsumptions()
	const formatPrints = useFormatPrints()
	const { productionNameById } = useProduction()
	const ddata = useMemo(() => {
		const res = {}
		for (let prod in consumptions) {
			const prodaction = {
				production_id: prod,
				production_name: productionNameById(prod),
				labels: [],
			}
			const formats = formatPrints[prod]
			for (let format in formats) {
				for (let label of formats[format]) {
					if (format === '.default') {
						prodaction.labels[label] = (prodaction.labels[label] || 0) + (consumptions[prod][label] || 0)
					} else {
						prodaction.labels[format] = (prodaction.labels[format] || 0) + (consumptions[prod][label] || 0)
					}
				}
			}
			prodaction.labels = Object.entries(prodaction.labels)
				.map(([label, sum]) => ({
					label,
					sum,
				}))
				.filter(({ sum }) => sum > 0)

			if (prodaction.labels.length > 0) {
				res[prod] = prodaction
			}
		}

		return res
	}, [consumptions, formatPrints])

	return useMemo(() => {
		if (production_id) {
			return ddata[production_id] || {}
		} else {
			return ddata
		}
	}, [ddata, production_id])
}

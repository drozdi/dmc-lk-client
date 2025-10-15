import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { ExpandablePanel } from '../../../shared/ui'
import { useProduction } from '../../../stores/hooks'
import { useFormatPrints, useFormatСonsumptions } from '../stores'

export const LabelsCountWidget = observer(() => {
	const formatPrints = useFormatPrints()
	const formatСonsumptions = useFormatСonsumptions()
	const { productionNameById } = useProduction()

	const res = useMemo(() => {
		const res = {}
		for (let prod in formatPrints) {
			res[prod] = res[prod] || {
				production_id: prod,
				production_name: productionNameById(prod),
				labels: {},
				total: 0,
				consumptions: 0,
				minus: 0,
			}
			for (let label in formatPrints[prod]) {
				if (label === '.default') {
					continue
				}
				res[prod].labels[label] = res[prod].labels[label] || {
					labels: [label].concat(formatPrints[prod][label]),
					total: 0,
					minus: 0,
					consumptions: 0,
					container: true,
				}
			}
			for (let label of formatPrints[prod]['.default'] || []) {
				res[prod].labels[label] = res[prod].labels[label] || {
					labels: [label],
					total: 0,
					minus: 0,
					consumptions: 0,
					container: false,
				}
			}
		}
		return res
	}, [formatPrints, formatСonsumptions])
	console.log(res)
	return (
		<ExpandablePanel title='Сводная'>
			<div></div>
		</ExpandablePanel>
	)
})

import { Accordion, Box, Table } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { useQueryLoading } from '../../../shared/hooks'
import { ExpandablePanel } from '../../../shared/ui'
import { useProduction } from '../../../stores/hooks'
import { countLabelStore, labelsStore, useCounts, useFormatPrints, useFormatСonsumptions } from '../stores'

export const LabelsCountWidget = observer(() => {
	const formatPrints = useFormatPrints()
	const formatСonsumptions = useFormatСonsumptions()
	const counts = useCounts()
	const { productionNameById } = useProduction()
	const isLoading = useQueryLoading(labelsStore, countLabelStore)

	const ddata = useMemo(() => {
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
			;(formatСonsumptions[prod]?.labels || []).forEach(item => {
				res[prod].labels[item.label].consumptions = item.sum
			})
		}
		for (const count of counts.distributed) {
			if (!count.production_id) {
				continue
			}
			if (res[count.production_id]?.labels?.[count.add_label_format]) {
				res[count.production_id].labels[count.add_label_format].total += count.sum
			}
		}
		for (const count of counts.not_distributed) {
			if (!count.production_id) {
				continue
			}
			if (res[count.production_id]?.labels?.[count.add_label_format]) {
				res[count.production_id].labels[count.add_label_format].total += count.sum
			}
		}
		for (let prod in res) {
			for (let label in res[prod].labels) {
				if (
					res[prod].labels[label].minus === 0 &&
					res[prod].labels[label].total === 0 &&
					res[prod].labels[label].consumptions === 0
				) {
					delete res[prod].labels[label]
				}
			}
			if (Object.values(res[prod].labels).length === 0) {
				res[prod] = undefined
				delete res[prod]
			}
		}
		Object.values(res).forEach(production => {
			if (production) {
				production.total = Object.values(production.labels).reduce((acc, item) => acc + item.total, 0)
				production.minus = Object.values(production.labels).reduce((acc, item) => acc + item.minus, 0)
				production.consumptions = Object.values(production.labels).reduce((acc, item) => acc + item.consumptions, 0)
			}
		})
		return Object.values(res)
	}, [formatPrints, counts, formatСonsumptions])

	return (
		<ExpandablePanel loading={isLoading} title='Сводная история'>
			<Accordion>
				{ddata.map(production => (
					<Accordion.Item key={production.production_id} value={'acc-' + production.production_id}>
						<Accordion.Control px='xs'>
							<Box my='-xs'>
								{production.production_name} ({production.production_id})
							</Box>
						</Accordion.Control>
						<Accordion.Panel>
							<Table withTableBorder withRowBorders withColumnBorders>
								<Table.Thead>
									<Table.Tr>
										<Table.Th>Этикетка</Table.Th>
										<Table.Th>Расход ленты(м)</Table.Th>
										<Table.Th>Остаток</Table.Th>
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>
									{Object.entries(production.labels).map(([label, { total, consumptions }]) => {
										return (
											<Table.Tr>
												<Table.Td>{label}</Table.Td>
												<Table.Td>{consumptions}</Table.Td>
												<Table.Td>{total}</Table.Td>
											</Table.Tr>
										)
									})}
								</Table.Tbody>
							</Table>
						</Accordion.Panel>
					</Accordion.Item>
				))}
			</Accordion>
		</ExpandablePanel>
	)
})

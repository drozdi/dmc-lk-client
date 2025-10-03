import dayjs from 'dayjs'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo, useState } from 'react'
import { TbList } from 'react-icons/tb'
import { useAnalytics } from '../apps/analytics/api'
import { requestLabelsCount } from '../apps/labels/api'
import { useLabelFormat } from '../apps/labels/entites/hooks'
import { GroupContainer } from '../apps/labels/features/components/group/container'
import { GroupItem } from '../apps/labels/features/components/group/item'
import { GroupProvider } from '../apps/labels/features/components/group/provider'
import { formatPrintStore } from '../apps/labels/stores/format-print-store'
import { useProduction } from '../components/stores/hooks/use-production'
import { useQuery } from '../shared/hooks'
import { DmcAccordion, DmcItemLabel, DmcMarkupTable } from '../shared/ui'

const dNow = dayjs('2025-05-02')

export const LabelsCountWidget = observer(() => {
	const labelsFormat = useLabelFormat()
	const [countP, setCountP] = useState({})
	const [data, setData] = useState({
		distributed: [],
		not_distributed: [],
	})
	const reqAnalytics = useAnalytics({
		filterdate: [dNow.day(dNow.day() - 7).format('YYYY-MM-DD'), dNow.format('YYYY-MM-DD')],
		step: 'd',
		event: 'p',
	})
	const reqLabelsCount = useQuery(requestLabelsCount)
	const { productionNameById } = useProduction()
	async function fetch() {
		setCountP((await reqAnalytics.request({})).message)
		setData((await reqLabelsCount.request()).data)
	}
	const res = useMemo(() => {
		const res = {}
		for (let prod in labelsFormat) {
			res[prod] = res[prod] || {
				production_id: prod,
				production_name: productionNameById(prod),
				labels: {},
				total: 0,
				minus: 0,
			}
			for (let label in labelsFormat[prod]) {
				if (label === '.default') {
					continue
				}
				res[prod].labels[label] = res[prod].labels[label] || {
					labels: [label].concat(labelsFormat[prod][label]),
					total: 0,
					minus: 0,
					container: true,
				}
			}
			for (let label of labelsFormat[prod]['.default'] || []) {
				res[prod].labels[label] = res[prod].labels[label] || {
					labels: [label],
					total: 0,
					minus: 0,
					container: false,
				}
			}
		}
		for (const count of data.distributed) {
			if (!count.production_id) {
				continue
			}
			if (res[count.production_id]?.labels?.[count.add_label_format]) {
				res[count.production_id].labels[count.add_label_format].total += count.sum
			}
		}
		for (const count of data.not_distributed) {
			if (!count.production_id) {
				continue
			}
			if (res[count.production_id]?.labels?.[count.add_label_format]) {
				res[count.production_id].labels[count.add_label_format].total += count.sum
			}
		}
		for (const production of countP.production || []) {
			for (const data of production.data || []) {
				Object.entries(res[production.production_id].labels).forEach(([label, labels]) => {
					if (labels.labels.includes(data.data)) {
						labels.minus += data.count
					}
				})
			}
		}
		for (let prod in res) {
			for (let label in res[prod].labels) {
				if (res[prod].labels[label].minus === 0 && res[prod].labels[label].total === 0) {
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
			}
		})
		console.log(res)
		return res
	}, [labelsFormat, data, countP])

	useEffect(() => {
		fetch()
	}, [])

	function factoryHandleDragEnd(production_id) {
		return async function handleDragEnd(event) {
			const { source, target } = event.operation
			const sourceIndex = data.not_distributed.findIndex(
				item => item.production_id === production_id && item.add_label_format === source.id
			)
			// if (sourceIndex === -1) {
			// 	return
			// }
			const sourceLabel = data.not_distributed.splice(sourceIndex, 1)[0]
			console.log({
				production_id: sourceLabel.production_id,
				add_label_format: target.id,
				statistics_print_format: sourceLabel.add_label_format,
			})

			await formatPrintStore.add({
				production_id: sourceLabel.production_id,
				add_label_format: target.id,
				statistics_print_format: sourceLabel.add_label_format,
			})

			/*data.distributed = data.distributed.map(item => {
				if (item.production_id === sourceLabel.production_id && item.add_label_format === target.id) {
					return {
						...item,
						sum: item.sum + sourceLabel.sum,
					}
				}
				return item
			})*/
		}
	}

	return (
		<DmcAccordion>
			<DmcAccordion.Tab value='main'>
				<DmcAccordion.Header classBody='!flex-row !justify-between'>
					<DmcItemLabel>Площадка</DmcItemLabel>
					<div className='flex gap-4'>
						<DmcItemLabel>расход: {Object.values(res).reduce((acc, item) => acc + item.minus, 0)}</DmcItemLabel>
						<DmcItemLabel>остаток: {Object.values(res).reduce((acc, item) => acc + item.total, 0)}</DmcItemLabel>
					</div>
				</DmcAccordion.Header>
				<DmcAccordion.Panel>
					<DmcAccordion border separated>
						{Object.values(res).map(production => {
							return (
								<DmcAccordion.Tab key={production.production_id} value={'acc-' + production.production_id}>
									<DmcAccordion.Header classBody='!flex-row !justify-between'>
										<DmcItemLabel>
											{production.production_name} ({production.production_id})
										</DmcItemLabel>
										<div className='flex gap-4'>
											<DmcItemLabel>расход: {production.minus}</DmcItemLabel>
											<DmcItemLabel>остаток: {production.total}</DmcItemLabel>
										</div>
									</DmcAccordion.Header>
									<DmcAccordion.Panel>
										<DmcMarkupTable layout='fixed' border rowBorder dense colBorder hover>
											<DmcMarkupTable.Thead>
												<DmcMarkupTable.Tr>
													<DmcMarkupTable.Th className='w-4'></DmcMarkupTable.Th>
													<DmcMarkupTable.Th>Этикетка</DmcMarkupTable.Th>
													<DmcMarkupTable.Th>Расход</DmcMarkupTable.Th>
													<DmcMarkupTable.Th>Остаток</DmcMarkupTable.Th>
												</DmcMarkupTable.Tr>
											</DmcMarkupTable.Thead>
											<GroupProvider onDragEnd={factoryHandleDragEnd(Number(production.production_id))}>
												<DmcMarkupTable.Tbody>
													{Object.entries(production.labels).map(([label, { total, minus, container }]) => {
														const Wrap = container ? GroupContainer : GroupItem
														const props = container ? { column: label } : { id: label, data: label }
														return (
															<Wrap {...props}>
																<DmcMarkupTable.Tr key={production.production_id + label}>
																	<DmcMarkupTable.Td className='!pl-1 cursor-pointer'>
																		{container === false && <TbList />}
																	</DmcMarkupTable.Td>
																	<DmcMarkupTable.Td>{label}</DmcMarkupTable.Td>
																	<DmcMarkupTable.Td>{minus}</DmcMarkupTable.Td>
																	<DmcMarkupTable.Td>{total}</DmcMarkupTable.Td>
																</DmcMarkupTable.Tr>
															</Wrap>
														)
													})}
												</DmcMarkupTable.Tbody>
											</GroupProvider>
										</DmcMarkupTable>
									</DmcAccordion.Panel>
								</DmcAccordion.Tab>
							)
						})}
					</DmcAccordion>
				</DmcAccordion.Panel>
			</DmcAccordion.Tab>
		</DmcAccordion>
	)
})

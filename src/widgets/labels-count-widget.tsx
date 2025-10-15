import { Accordion, Group, Table, Text } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo, useState } from 'react'
import { TbList } from 'react-icons/tb'
import { useAnalytics } from '../apps/analytics/api'
import { requestLabelsCount } from '../apps/labels/api'
import { GroupContainer } from '../apps/labels/features/components/group/container'
import { GroupItem } from '../apps/labels/features/components/group/item'
import { GroupProvider } from '../apps/labels/features/components/group/provider'
import { labelsStore } from '../apps/labels/stores'
import { useLabelFormat } from '../apps/labels/stores/hooks'
import { useQuery } from '../shared/hooks'
import { ExpandablePanel } from '../shared/ui'
import { useProduction } from '../stores/hooks/use-production'

export const LabelsCountWidget = observer(props => {
	const labelsFormat = useLabelFormat()
	const [countP, setCountP] = useState({})
	const [data, setData] = useState({
		distributed: [],
		not_distributed: [],
	})
	const reqAnalytics = useAnalytics({
		...props,
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

			await labelsStore.addFormatPrint({
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
		<ExpandablePanel loading={reqAnalytics.isLoading || reqLabelsCount.isLoading} title={''}>
			<Accordion variant='unstyled'>
				<Accordion.Item value='main'>
					<Accordion.Control>
						<Group justify='space-between'>
							<Text>Площадка</Text>
							<Group justify='space-between' miw='50%'>
								<Text>расход: {Object.values(res).reduce((acc, item) => acc + item.minus, 0)}</Text>
								<Text miw='50%'>остаток: {Object.values(res).reduce((acc, item) => acc + item.total, 0)}</Text>
							</Group>
						</Group>
					</Accordion.Control>
					<Accordion.Panel>
						<Accordion variant='contained' chevronPosition='left'>
							{Object.values(res).map(production => {
								return (
									<Accordion.Item key={production.production_id} value={'acc-' + production.production_id}>
										<Accordion.Control>
											<Group justify='space-between'>
												<Text>
													{production.production_name} ({production.production_id})
												</Text>
												<Group justify='space-between' miw='50%'>
													<Text>расход: {production.minus}</Text>
													<Text miw='50%'>остаток: {production.total}</Text>
												</Group>
											</Group>
										</Accordion.Control>
										<Accordion.Panel>
											<Table layout='fixed' withTableBorder withRowBorders withColumnBorders highlightOnHover>
												<Table.Thead>
													<Table.Tr>
														<Table.Th w='2rem'></Table.Th>
														<Table.Th>Этикетка</Table.Th>
														<Table.Th>Расход</Table.Th>
														<Table.Th>Остаток</Table.Th>
													</Table.Tr>
												</Table.Thead>
												<GroupProvider onDragEnd={factoryHandleDragEnd(Number(production.production_id))}>
													<Table.Tbody>
														{Object.entries(production.labels).map(([label, { total, minus, container }]) => {
															const Wrap = container ? GroupContainer : GroupItem
															const props = container ? { column: label } : { id: label, data: label }
															return (
																<Wrap key={production.production_id + label} {...props}>
																	<Table.Tr>
																		<Table.Td ta='center'>{container === false && <TbList />}</Table.Td>
																		<Table.Td>{label}</Table.Td>
																		<Table.Td>{minus}</Table.Td>
																		<Table.Td>{total}</Table.Td>
																	</Table.Tr>
																</Wrap>
															)
														})}
													</Table.Tbody>
												</GroupProvider>
											</Table>
										</Accordion.Panel>
									</Accordion.Item>
								)
							})}
						</Accordion>
					</Accordion.Panel>
				</Accordion.Item>
			</Accordion>
		</ExpandablePanel>
	)
})

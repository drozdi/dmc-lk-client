import { Accordion, Notification } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from '../../../shared/hooks'
import { ItemLabel, List, Loading } from '../../../shared/ui'
import { userStore } from '../../../stores/user-store'
import { requestLabelsCount } from '../api'
import { formatPrintStore } from '../stores/format-print-store'

import { ReportItem } from './components/report/item'

import { GroupContainer } from './components/group/container'
import { GroupItem } from './components/group/item'
import { GroupProvider } from './components/group/provider'

export const LabelsCount = observer(() => {
	const { isLoading, error, request } = useQuery(requestLabelsCount)
	const { products } = userStore
	const [dangerLimits, setDangerLimits] = useState(0)
	const [warningLimits, setWarningLimits] = useState(-50)

	const [data, setData] = useState({
		distributed: [],
		not_distributed: [],
	})
	const productionName = useCallback(
		id => products.find(item => item?.production_id === id)?.name_production,
		[products]
	)
	const filterProdaction = useCallback(item => {
		return !!item?.production_id
	}, [])

	const ddata = useMemo(() => {
		const prod = {}
		data.distributed.forEach(item => {
			if (!filterProdaction(item)) {
				return
			}
			prod[item.production_id] = prod[item.production_id] || {
				production_id: item.production_id,
				name: productionName(item.production_id),
				sum: 0,
				distributed: [],
				notDistributed: [],
			}
			prod[item.production_id].sum += item.sum
			prod[item.production_id].distributed.push(item)
		})
		data.not_distributed.forEach(item => {
			if (!filterProdaction(item)) {
				return
			}
			prod[item.production_id] = prod[item.production_id] || {
				production_id: item.production_id,
				name: productionName(item.production_id),
				sum: 0,
				distributed: [],
				notDistributed: [],
			}
			prod[item.production_id].sum += item.sum
			prod[item.production_id].notDistributed.push(item)
		})
		return Object.values(prod)
	}, [data, filterProdaction, productionName])

	async function fetch() {
		const res = await request()
		setData(res.data)
	}
	function updateItem(res) {
		for (const [, colections] of Object.entries(data)) {
			const item = colections.find(
				item => item.add_label_format === res.format_template && item.production_id === res.production_id
			)
			if (item) {
				item.sum += res.count_label
			}
		}
		setData({ ...data })
	}

	useEffect(() => {
		fetch()
	}, [])

	const findIndex = (item, id) => item === id || (typeof item === 'object' && 'id' in item && item.id === id)

	function factoryHandleDragEnd(production_id) {
		return async function handleDragEnd(event) {
			const { source, target } = event.operation
			const sourceIndex = data.not_distributed.findIndex(
				item => item.production_id === production_id && item.add_label_format === source.id
			)
			if (sourceIndex === -1) {
				return
			}
			const sourceLabel = data.not_distributed.splice(sourceIndex, 1)[0]

			await formatPrintStore.add({
				production_id: sourceLabel.production_id,
				add_label_format: target.id,
				statistics_print_format: sourceLabel.add_label_format,
			})

			data.distributed = data.distributed.map(item => {
				if (item.production_id === sourceLabel.production_id && item.add_label_format === target.id) {
					return {
						...item,
						sum: item.sum + sourceLabel.sum,
					}
				}
				return item
			})

			setData({ ...data })
		}
	}

	return (
		<>
			{error && <Notification color='red'>{error}</Notification>}
			<Loading active={isLoading} keepMounted>
				<Accordion variant='contained'>
					{ddata.map(item => (
						<Accordion.Item key={item.production_id} value={`acc-${item.production_id}`}>
							<Accordion.Control>{item.name}</Accordion.Control>
							<Accordion.Panel>
								<List separator>
									<GroupProvider onDragEnd={factoryHandleDragEnd(item.production_id)}>
										{item.distributed?.length > 0 && <ItemLabel header>Сгрупированые</ItemLabel>}
										{item.distributed.map(item => (
											<GroupContainer key={item.add_label_format} column={item.add_label_format}>
												<ReportItem
													item={item}
													dangerLimits={dangerLimits}
													warningLimits={warningLimits}
													onUpdate={updateItem}
												/>
											</GroupContainer>
										))}

										{item.notDistributed?.length > 0 && <ItemLabel header>Без группы</ItemLabel>}
										{item.notDistributed.map(item => (
											<GroupItem key={item.add_label_format} id={item.add_label_format} data={item}>
												<ReportItem
													groupable
													item={item}
													dangerLimits={dangerLimits}
													warningLimits={warningLimits}
													onUpdate={updateItem}
												/>
											</GroupItem>
										))}
									</GroupProvider>
								</List>
							</Accordion.Panel>
						</Accordion.Item>
					))}
				</Accordion>
			</Loading>
		</>
	)
})

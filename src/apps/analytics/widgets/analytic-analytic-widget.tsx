import { Select, Table } from '@mantine/core'
import dayjs from 'dayjs'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExpandablePanel } from '../../../shared/ui'
import { useAnalytics } from '../api'
import { mapEvent } from '../entites/constants'

const nDow = dayjs('2025-05-02')
const sDay = nDow.day(nDow.day() - 7)
const maps = Object.keys(mapEvent)

export const AnalyticAnalyticWidget = observer(() => {
	const navigate = useNavigate()
	const { isLoading, request } = useAnalytics({
		filterdate_from: sDay.format('YYYY-MM-DD'),
		filterdate_to: nDow.format('YYYY-MM-DD'),
		step: 'd',
	})
	const [data, setData] = useState<{
		v?: IAnalyticsResponse
		i?: IAnalyticsResponse
		d?: IAnalyticsResponse
		p?: IAnalyticsResponse
	}>({})
	const [cuurent_production, setCurrentProduction] = useState('0')

	useEffect(() => {
		const send = async () => {
			setData({
				v: await request({ event: 'v' }),
				i: await request({ event: 'i' }),
				d: await request({ event: 'd' }),
				p: await request({ event: 'p' }),
			})
		}
		send()
	}, [])
	const productions = useMemo(() => {
		const productions: IProductionAnalytics[] = []
		if (data) {
			for (const event in mapEvent) {
				data[event]?.production?.forEach(item => {
					if (productions.findIndex(production => production.value === String(item.production_id)) === -1) {
						productions.push({
							value: String(item.production_id),
							label: item.name,
						})
					}
				})
			}
		}
		return productions
	}, [data])

	const ddata = useMemo(() => {
		const res = {}
		const def = Object.fromEntries(Object.keys(mapEvent).map(key => [key, 0]))
		for (let i = 0; i < 7; i++) {
			res[sDay.day(sDay.day() + i).format('YYYY-MM-DD')] = { ...def }
		}
		const currProduction = Number(cuurent_production) || 0

		if (data) {
			for (let event of maps) {
				for (let production of data[event]?.production || []) {
					if (currProduction > 0 && production.production_id === currProduction) {
						continue
					}
					for (let d of production.data || []) {
						res[dayjs(d.timestamp).format('YYYY-MM-DD')][event] += d.count
					}
				}
			}
		}

		return Object.entries(res).map(([label, value]) => ({ ...value, label }))
	}, [data, cuurent_production])

	const isEmpty = useMemo(() => !ddata.length, [ddata])

	return (
		<ExpandablePanel
			loading={isLoading}
			title={`Отчет c ${sDay.format('YYYY-MM-DD')} по ${nDow.day(nDow.day() - 1).format('YYYY-MM-DD')}`}
		>
			<Select
				defaultValue={String(cuurent_production)}
				checkIconPosition='right'
				onChange={setCurrentProduction}
				data={[
					{
						value: '0',
						label: 'Все площадки',
					},
				].concat(productions)}
			/>
			<Table>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Дата</Table.Th>
						{maps.map(key => (
							<Table.Th key={key}>{mapEvent[key]}</Table.Th>
						))}
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{ddata.map(({ label, ...values }) => (
						<Table.Tr
							key={label}
							onClick={() => navigate(`/analytics/incident/day?day=${label}`)}
							style={{ cursor: 'pointer' }}
						>
							<Table.Td>{label}</Table.Td>
							{maps.map(key => (
								<Table.Td key={key}>{values[key]}</Table.Td>
							))}
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
		</ExpandablePanel>
	)
})

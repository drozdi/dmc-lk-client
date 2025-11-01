import dayjs from 'dayjs'
import { memo, useEffect, useMemo, useState } from 'react'
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ReferenceArea,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

import { AspectRatio, Button, Group, Select, Stack } from '@mantine/core'
import { ExpandablePanel } from '../../../shared/ui'
import { useAnalytics } from '../api'
import { mapEvent, mapEventColor } from '../entites/constants'

interface ChartAnalyticProps extends Omit<IAnalyticsQuery, 'event'> {}

const initialState = {
	refAreaLeft: '',
	refAreaRight: '',
	animation: true,
}

export const AnalyticEventWidget = memo((props: ChartAnalyticProps) => {
	//return ''
	const { isLoading, request } = useAnalytics()
	const [cuurent_production, setCurrentProduction] = useState(0)
	const [data, setData] = useState<{
		v?: IAnalyticsResponse
		i?: IAnalyticsResponse
		d?: IAnalyticsResponse
		p?: IAnalyticsResponse
	}>()

	const [query, setQuery] = useState<ChartAnalyticProps>({ ...props })
	function reset() {
		setQuery({ ...props })
	}
	async function sendRequest(event: IAnalyticsQuery['event']) {
		return await request({ ...query, event })
	}

	// Извлекаем список площадок
	const productions = useMemo<IProductionAnalytics[]>(() => {
		const productions: IProductionAnalytics[] = []
		if (data) {
			for (const event in mapEvent) {
				data[event]?.production?.forEach(item => {
					if (productions.findIndex(production => production.value === String(item.production_id)) === -1) {
						productions.push({
							value: String(item.production_id),
							label: item.name,
							address: item.address,
						})
					}
				})
			}
		}
		return productions
	}, [data])

	// Извлекаем список дат
	const labels = useMemo<string[]>(() => {
		let res: string[] = []
		if (data) {
			for (const event in mapEvent) {
				for (const p of data[event]?.production || []) {
					res = res.concat(p.data.map(item => item.timestamp))
				}
			}
		}
		return [...new Set(res)].sort()
	}, [data])
	// Извлекаем, групируем данные
	const ddata = useMemo(() => {
		const initialData = Object.fromEntries(
			labels.map(item => [item, Object.fromEntries(Object.keys(mapEvent).map(item => [item, 0]))])
		)
		const currProduction = Number(cuurent_production || 0)
		for (const event in mapEvent) {
			if (!data?.[event]?.production) {
				continue
			}
			for (const p of data[event].production) {
				if (currProduction > 0 && p.production_id !== currProduction) {
					continue
				}
				;(p.data as any[]).forEach(item => {
					initialData[item.timestamp][event] += item.count
				})
			}
		}
		return Object.entries(initialData).map(([name, data]) => ({
			...data,
			name,
		}))
	}, [data, labels, cuurent_production])

	const isEmpty = useMemo(() => !ddata.length, [ddata])

	useEffect(() => {
		const send = async () => {
			setData({
				v: await sendRequest('v'),
				i: await sendRequest('i'),
				d: await sendRequest('d'),
				p: await sendRequest('p'),
			})
		}
		send()
	}, [query])

	useEffect(() => {
		setQuery(props)
	}, [props])

	const stepLow = (from, to) => {
		const dFrom = dayjs(from)
		const dTo = dayjs(to)

		let d = dTo.diff(dFrom) / 1000 / 60 / 60 / 24

		if (d > 60) {
			setQuery({
				...query,
				step: 'mon',
				filterdate_from: dFrom.format('YYYY-MM-DD'),
				filterdate_to: dTo.format('YYYY-MM-DD'),
			})
		} else if (d > 7) {
			setQuery({
				...query,
				step: 'd',
				filterdate_from: dFrom.format('YYYY-MM-DD'),
				filterdate_to: dTo.format('YYYY-MM-DD'),
			})
		} else {
			d *= 24
			if (d > 24) {
				setQuery({
					...query,
					step: 'h',
					filterdate_from: dFrom.format('YYYY-MM-DD HH:mm'),
					filterdate_to: dTo.format('YYYY-MM-DD HH:mm'),
				})
			} else {
				d *= 60
				if (d > 60) {
					setQuery({
						...query,
						step: 'm',
						filterdate_from: dFrom.format('YYYY-MM-DD HH:mm:ss'),
						filterdate_to: dTo.format('YYYY-MM-DD HH:mm:ss'),
					})
				} else {
					d *= 60
					setQuery({
						...query,
						step: 's',
						filterdate_from: dFrom.format('YYYY-MM-DD HH:mm:ss'),
						filterdate_to: dTo.format('YYYY-MM-DD HH:mm:ss'),
					})
				}
			}
		}
	}

	const [state, setState] = useState<{
		refAreaLeft: string | number
		refAreaRight: string | number
		animation: boolean
	}>(initialState)
	const { refAreaLeft, refAreaRight } = state

	const handleMouseDown = event => {
		setState(prevState => ({ ...prevState, refAreaLeft: event.activeLabel }))
	}
	const handleMouseMove = event => {
		state.refAreaLeft && setState(prevState => ({ ...prevState, refAreaRight: event.activeLabel }))
	}
	const handleMouseUp = event => {
		let { refAreaLeft, refAreaRight } = state

		if (refAreaLeft === refAreaRight || refAreaRight === '') {
			setState(prevState => ({
				...prevState,
				refAreaLeft: '',
				refAreaRight: '',
			}))
			return
		}

		if (refAreaLeft > refAreaRight) {
			;[refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft]
		}

		stepLow(refAreaLeft, refAreaRight)
		setState(prevState => ({
			...prevState,
			refAreaLeft: '',
			refAreaRight: '',
		}))
	}

	const title = useMemo(() => {
		return (
			dayjs(query.filterdate_from).format('YYYY-MM-DD') + ' - ' + dayjs(query.filterdate_to || '').format('YYYY-MM-DD')
		)
	}, [query])

	return (
		<ExpandablePanel title={title} loading={isLoading}>
			<Stack h='100%'>
				<Group gap='0' grow>
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
					<Button onClick={reset}>Сбросить</Button>
				</Group>
				<AspectRatio ratio={16 / 9}>
					{isEmpty ? (
						<span>Данные ненашлись!</span>
					) : (
						<ResponsiveContainer>
							<LineChart
								data={ddata}
								onMouseDown={handleMouseDown}
								onMouseMove={handleMouseMove}
								onMouseUp={handleMouseUp}
							>
								<CartesianGrid stroke='#aaa' strokeDasharray='5 5' />
								<XAxis dataKey='name' />
								<YAxis />
								<Tooltip />
								<Legend />
								<Line name={mapEvent.d} type='monotone' dataKey='d' stroke={mapEventColor.d} label={mapEvent.d} />
								<Line name={mapEvent.i} type='monotone' dataKey='i' stroke={mapEventColor.i} label={mapEvent.i} />
								<Line name={mapEvent.v} type='monotone' dataKey='v' stroke={mapEventColor.v} label={mapEvent.v} />
								{refAreaLeft && refAreaRight ? (
									<ReferenceArea x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />
								) : null}
							</LineChart>
						</ResponsiveContainer>
					)}
				</AspectRatio>
			</Stack>
		</ExpandablePanel>
	)
})

import dayjs from 'dayjs'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

import { Btn, Loading, Select } from '../../../shared/ui'
import { useAnalytics } from '../api/api'
import { mapEvent } from '../entites/constants'

interface ChartAnalyticProps extends Omit<IAnalyticsQuery, 'event'> {}

export const AnalyticEventWidget = memo((props: ChartAnalyticProps) => {
	//return ''
	const { isLoading, request } = useAnalytics()
	const ref = useRef(null)
	const [cuurent_production, setCurrentProduction] = useState(0)
	const [data, setData] = useState<{
		v?: IAnalyticsResponse
		i?: IAnalyticsResponse
		d?: IAnalyticsResponse
		p?: IAnalyticsResponse
	}>()
	const [errors, setErrors] = useState<{
		filterdate_from?: string
		filterdate_to?: string
		step?: string
		event?: string
	}>({})
	const [query, setQuery] = useState<ChartAnalyticProps>({ ...props })
	function reset() {
		setQuery({ ...props })
	}
	function validate() {
		try {
			if (!props.filterdate_from && !props.filterdate_to) {
				if (!props.filterdate_from) {
					errors.filterdate_from = 'Поле обязательно для заполнения'
				}
				if (!props.filterdate_to) {
					errors.filterdate_to = 'Поле обязательно для заполнения'
				}
			}
			if (!props.step) {
				errors.step = 'Поле обязательно для заполнения'
			}
			if (!event) {
				errors.event = 'Поле обязательно для заполнения'
			}
			setErrors(errors)
		} catch (error) {
			console.error(error)
		}
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
					if (
						productions.findIndex(
							production => production.production_id === item.production_id
						) === -1
					) {
						productions.push({
							name: item.name,
							address: item.address,
							production_id: item.production_id,
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
	const datasets = useMemo(() => {
		if (!labels.length) {
			return []
		}
		const res = {
			v: {
				label: mapEvent.v,
				data: new Array(labels.length).fill(0),
				borderColor: 'rgb(0, 255, 132)',
				backgroundColor: 'rgba(0, 255, 132, 0.5)',

				yAxisID: 'y',
			},
			i: {
				label: mapEvent.i,
				data: new Array(labels.length).fill(0),
				borderColor: 'rgb(255, 99, 132)',
				backgroundColor: 'rgba(255, 99, 132, 0.5)',
				yAxisID: 'y',
			},
			d: {
				label: mapEvent.d,
				data: new Array(labels.length).fill(0),
				borderColor: 'rgb(53, 162, 235)',
				backgroundColor: 'rgba(53, 162, 235, 0.5)',
				yAxisID: 'y',
			},
			p: {
				label: mapEvent.p,
				data: new Array(labels.length).fill(0),
				borderColor: 'rgb(0, 99, 132)',
				backgroundColor: 'rgba(0, 99, 132, 0.5)',
				yAxisID: 'y',
			},
		}
		if (data) {
			for (const event in res) {
				for (const p of data[event]?.production || []) {
					if (
						cuurent_production > 0 &&
						p.production_id !== cuurent_production
					) {
						continue
					}
					;(p.data as any[]).forEach(item => {
						res[event].data[labels.indexOf(item.timestamp)] += item.count
					})
				}
			}
		}
		return [res.v, res.i, res.d]
	}, [data, labels, cuurent_production])

	const ddata = useMemo(() => {
		const initialData = Object.fromEntries(
			labels.map(item => [
				item,
				Object.fromEntries(Object.keys(mapEvent).map(item => [item, 0])),
			])
		)
		for (const event in mapEvent) {
			if (!data?.[event]?.production) {
				continue
			}
			for (const p of data[event].production) {
				if (cuurent_production > 0 && p.production_id !== cuurent_production) {
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
				v: (await sendRequest('v')).message,
				i: (await sendRequest('i')).message,
				d: (await sendRequest('d')).message,
				p: (await sendRequest('p')).message,
			})
		}
		validate()
		send()
	}, [query])

	const stepLow = useCallback(
		(index: number) => {
			const d = dayjs(labels[index])
			let step: ChartAnalyticProps['step'] = query.step
			let filterdate_from: ChartAnalyticProps['filterdate_from'] =
				query.filterdate_from
			let filterdate_to: ChartAnalyticProps['filterdate_to'] =
				query.filterdate_to

			switch (query.step) {
				case 'y':
					step = 'mon'
					filterdate_from = d.year(d.year() - 1).format('YYYY-MM-DD')
					filterdate_to = d.format('YYYY-MM-DD')
					break
				case 'mon':
					step = 'd'
					filterdate_from = d.month(d.month() - 1).format('YYYY-MM-DD')
					filterdate_to = d.format('YYYY-MM-DD')
					break
				case 'd':
					step = 'h'
					filterdate_from = d.date(d.date() - 1).format('YYYY-MM-DD HH:mm:ss')
					filterdate_to = d.format('YYYY-MM-DD HH:mm:ss')
					break
				case 'h':
					step = 'm'
					filterdate_from = d.hour(d.hour() - 1).format('YYYY-MM-DD HH:mm:ss')
					filterdate_to = d.format('YYYY-MM-DD HH:mm:ss')
					break
				case 'm':
					step = 's'
					filterdate_from = d
						.minute(d.minute() - 1)
						.format('YYYY-MM-DD HH:mm:ss')
					filterdate_to = d.format('YYYY-MM-DD HH:mm:ss')
					break
			}

			setQuery({
				filterdate_from,
				filterdate_to,
				step,
			})
		},
		[labels, query]
	)

	useEffect(() => {
		console.log(ddata)
	}, [ddata])

	return (
		<div className='flex flex-col items-center justify-start gap-3 max-w-full max-h-full'>
			<h2 className='mb-3 w-full text-left'>ChartAnalytic</h2>
			<div className='flex w-full gap-0 justify-end'>
				<Select
					label='Площадка'
					name='production_id'
					value={String(cuurent_production)}
					onChange={(e: React.ChangeEvent) =>
						setCurrentProduction(parseInt(e.target.value, 10))
					}
					dense
					square
					filled
					underlined
					hideMessage
				>
					<option value='0' selected>
						Все площадки
					</option>
					{productions.map(item => (
						<option key={item.production_id} value={item.production_id}>
							{item.name}
						</option>
					))}
				</Select>
				<Btn className='flex-none' color='primary' square onClick={reset}>
					Сбросить
				</Btn>
			</div>
			<Loading active={isLoading}>
				{isEmpty ? (
					<span>Данные ненашлись!</span>
				) : (
					<LineChart width={500} height={300} data={ddata}>
						<CartesianGrid stroke='#aaa' strokeDasharray='5 5' />
						<XAxis dataKey='name' />
						<YAxis />
						<Tooltip />
						<Legend />
						<Line
							type='monotone'
							dataKey='d'
							stroke='#35a2eb'
							label={mapEvent.d}
						/>
						<Line
							type='monotone'
							dataKey='i'
							stroke='#ff6384'
							label={mapEvent.i}
						/>
						<Line
							type='monotone'
							dataKey='v'
							stroke='#00ff84'
							label={mapEvent.v}
						/>
					</LineChart>
				)}
			</Loading>
		</div>
	)
})

/**
 * v: '#00ff84',
 * i: '#ff6384',
 * d: '#35a2eb',
 * p: '#006384'
 * */

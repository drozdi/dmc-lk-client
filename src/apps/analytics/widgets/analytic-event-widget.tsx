import dayjs from 'dayjs'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

import { DmcBtn, DmcLoading, DmcSelect } from '../../../shared/ui'
import { useAnalytics } from '../api/api'
import { mapEvent } from '../entites/constants'

interface ChartAnalyticProps extends Omit<IAnalyticsQuery, 'event'> {}

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
		send()
	}, [query])

	useEffect(() => {
		setQuery(props)
	}, [props])

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

	const handleMouseDown = (...args) => {
		//console.log('handleMouseDown', args)
	}
	const handleMouseMove = (...args) => {
		//console.log('handleMouseMove', args)
	}
	const handleMouseUp = (...args) => {
		//console.log('handleMouseUp', args)
	}

	return (
		<div className='flex flex-col items-center justify-start gap-3 max-w-full max-h-full'>
			<h2 className='mb-3 w-full text-left'>ChartAnalytic</h2>
			<div className='flex w-full gap-0 justify-end'>
				<DmcSelect
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
				</DmcSelect>
				<DmcBtn className='flex-none' color='primary' square onClick={reset}>
					Сбросить
				</DmcBtn>
			</div>
			<div className='w-full aspect-square max-h-1/2 max-w-1/2'>
				<DmcLoading active={isLoading}>
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
								<Line
									name={mapEvent.d}
									type='monotone'
									dataKey='d'
									stroke='#35a2eb'
									label={mapEvent.d}
								/>
								<Line
									name={mapEvent.i}
									type='monotone'
									dataKey='i'
									stroke='#ff6384'
									label={mapEvent.i}
								/>
								<Line
									name={mapEvent.v}
									type='monotone'
									dataKey='v'
									stroke='#00ff84'
									label={mapEvent.v}
								/>
							</LineChart>
						</ResponsiveContainer>
					)}
				</DmcLoading>
			</div>
		</div>
	)
})

/**
 * v: '#00ff84',
 * i: '#ff6384',
 * d: '#35a2eb',
 * p: '#006384'
 * */

import {
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
} from 'chart.js'
import dayjs from 'dayjs'
import React, {
	memo,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { getElementsAtEvent, Line } from 'react-chartjs-2'
import { useAnalytics } from '../../entites/analytics/api'
import { mapEvent } from '../../entites/analytics/constants'
import { Btn, Loading, Select } from '../../shared/ui'

interface ChartAnalyticProps extends Omit<IAnalyticsQuery, 'event'> {}

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
)

export const ChartAnalyticWidget = memo((props: ChartAnalyticProps) => {
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
		if (data) {
			return (
				((data?.v || data?.i || data?.d || data?.p)
					?.production as Array<IProductionAnalytics>) || []
			).map(item => ({
				address: item.address,
				name: item.name,
				production_id: item.production_id,
			}))
		}
		return []
	}, [data])
	// Извлекаем список дат
	const labels = useMemo<string[]>(() => {
		let res: string[] = []
		if (data) {
			for (const event in mapEvent) {
				for (const p of data[event].production) {
					res = res.concat(p.data.map(item => item.timestamp))
				}
			}
		}
		return [...new Set(res)].sort()
	}, [data])
	// Извлекаем, групируем данные
	const datasets = useMemo(() => {
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
				for (const p of data[event].production) {
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

	useEffect(() => {
		console.log(data)
	}, [data])
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

	

	const stepLow = useCallback((index: number) => {
		const d = dayjs(labels[index])
		let step: ChartAnalyticProps['step'] = query.step
		let filterdate_from: ChartAnalyticProps['filterdate_from'] = query.filterdate_from
		let filterdate_to: ChartAnalyticProps['filterdate_to'] = query.filterdate_to

		switch (query.step) {
			case 'mon':
				step = 'd'
				filterdate_from = d.month(d.month()-1).format('YYYY-MM-DD')
				filterdate_to = d.format('YYYY-MM-DD')
				break;
		}

		setQuery({
			filterdate_from,
			filterdate_to,
			step,
		})

	}, [labels, query])

	const onClick = useCallback((event: React.MouseEvent) => {
		const items = getElementsAtEvent(ref.current, event)
		if (items.length === 0) {
			return
		}
		stepLow(items[0].index)
	}, [stepLow])

	return (
		<>
			<h2 className='mb-3'>ChartAnalytic</h2>
			<div className='flex w-full gap-0 items-start justify-end'>
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
				<Btn className='flex-none' color='primary' size='sm' square onClick={reset}>
					Сбросить
				</Btn>
			</div>
			<br />
			<Loading active={isLoading}>
				<Line
					data={{ labels, datasets }}
					onClick={onClick}
					ref={ref}
				/>
			</Loading>
		</>
	)
})

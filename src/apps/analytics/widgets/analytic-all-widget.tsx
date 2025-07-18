import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import React, { useEffect, useMemo, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import { Loading, Select } from '../../../shared/ui'
import { useAnalytics } from '../api/api'
import { mapEvent } from '../entites/constants'

interface ChartAnalyticProps extends Omit<IAnalyticsQuery, 'event'> {}

ChartJS.register(ArcElement, Tooltip, Legend)
const arr = 'v i d'.split(/\s+/)
const labels = arr.map(key => mapEvent[key])

export const AnalyticAllWidget = (props: ChartAnalyticProps) => {
	//return ''
	const { isLoading, request } = useAnalytics()
	const [cuurent_production, setCurrentProduction] = useState(0)
	const [data, setData] = useState<{
		v?: IAnalyticsResponse
		i?: IAnalyticsResponse
		d?: IAnalyticsResponse
		p?: IAnalyticsResponse
	}>({})
	const [errors, setErrors] = useState<{
		filterdate_from?: string
		filterdate_to?: string
		step?: string
		event?: string
	}>({})
	const [query, setQuery] = useState<ChartAnalyticProps>({ ...props })
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

	// Извлекаем, групируем данные
	const datasets = useMemo(() => {
		const res = {
			v: {
				label: mapEvent.v,
				data: 0,
				borderColor: 'rgb(0, 255, 132)',
				backgroundColor: 'rgba(0, 255, 132, 0.5)',
				yAxisID: 'y',
			},
			i: {
				label: mapEvent.i,
				data: 0,
				borderColor: 'rgb(255, 99, 132)',
				backgroundColor: 'rgba(255, 99, 132, 0.5)',
				yAxisID: 'y',
			},
			d: {
				label: mapEvent.d,
				data: 0,
				borderColor: 'rgb(53, 162, 235)',
				backgroundColor: 'rgba(53, 162, 235, 0.5)',
				yAxisID: 'y',
			},
			p: {
				label: mapEvent.p,
				data: 0,
				borderColor: 'rgb(0, 99, 132)',
				backgroundColor: 'rgba(0, 99, 132, 0.5)',
				yAxisID: 'y',
			},
		}
		if (data) {
			for (const event of arr) {
				if (cuurent_production > 0) {
					res[event].data = data[event].production.find(
						item => item.production_id === cuurent_production
					).all_label_prod
				} else {
					res[event].data = data[event]?.sum_company
				}
			}
		}
		return [
			{
				label: '# of Votes',
				data: arr.map(event => res[event]?.data),
				backgroundColor: arr.map(event => res[event]?.backgroundColor),
				borderColor: arr.map(event => res[event]?.borderColor),
				borderWidth: 1,
			},
		]
	}, [data, cuurent_production])

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

	return (
		<div className='flex flex-col items-center justify-start gap-3 max-w-full max-h-full'>
			<h2 className='mb-3 flex-none text-left w-full'>Все</h2>
			<div className='flex flex-none w-full gap-0 items-start justify-end'>
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
			</div>
			<div className='flex-1'>
				<Loading active={isLoading}>
					<Pie data={{ labels, datasets }} />
				</Loading>
			</div>
		</div>
	)
}

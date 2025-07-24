import React, { useEffect, useMemo, useState } from 'react'
import {
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
} from 'recharts'
import { Loading, Select } from '../../../shared/ui'
import { useAnalytics } from '../api/api'
import { mapEvent } from '../entites/constants'

interface ChartAnalyticProps extends Omit<IAnalyticsQuery, 'event'> {}

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

	// Извлекаем, групируем данные
	const ddata = useMemo(() => {
		const res = {
			v: { value: 0, color: '#00ff84' },
			d: { value: 0, color: '#35a2eb' },
			i: { value: 0, color: '#ff6384' },
		}

		if (data) {
			for (const event in res) {
				if (cuurent_production > 0) {
					res[event].value = data[event].production.find(
						item => item.production_id === cuurent_production
					).all_label_prod
				} else {
					res[event].value = data[event]?.sum_company
				}
			}
		}

		return Object.entries(res).map(([name, { value, color }]) => ({
			name: mapEvent[name],
			value,
			color,
		}))
	}, [data, cuurent_production])

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
			<div className='w-full aspect-square'>
				<Loading active={isLoading}>
					{isEmpty ? (
						<span>Данные ненашлись!</span>
					) : (
						<ResponsiveContainer>
							<PieChart>
								<Tooltip />
								<Legend />
								<Pie
									data={ddata}
									cx='50%'
									cy='50%'
									label
									fill='#8884d8'
									dataKey='value'
								>
									{ddata.map((entry, index) => (
										<Cell key={`cell-${entry.name}`} fill={entry.color} />
									))}
								</Pie>
							</PieChart>
						</ResponsiveContainer>
					)}
				</Loading>
			</div>
		</div>
	)
}

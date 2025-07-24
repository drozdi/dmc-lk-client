import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import { Btn, Loading, Select } from '../../../shared/ui'
import { randomColor } from '../../../shared/utils'
import { useAnalytics } from '../api/api'

interface ChartAnalyticProps extends Omit<IAnalyticsQuery, 'event'> {}

export const AnalyticTypeWidget = memo((props: ChartAnalyticProps) => {
	const { isLoading, request } = useAnalytics()
	const [cuurent_production, setCurrentProduction] = useState(0)
	const [data, setData] = useState<IAnalyticsResponse>()
	const [query, setQuery] = useState<ChartAnalyticProps>({ ...props })

	function reset() {
		setQuery({ ...props })
	}
	async function sendRequest(event: IAnalyticsQuery['event']) {
		return await request({ ...query, event })
	}

	// Извлекаем список площадок
	const productions = useMemo<IProductionAnalytics[]>(() => {
		if (data) {
			return ((data?.production as Array<IProductionAnalytics>) || []).map(
				item => ({
					address: item.address,
					name: item.name,
					production_id: item.production_id,
				})
			)
		}
		return []
	}, [data])
	const [filterGap, setFilterGap] = useState<boolean>(true)
	const formatName = useCallback(
		(name: string) => {
			try {
				name = (name || '').toUpperCase().replace(/\./g, '')
				return filterGap ? name.split('G')[0] : name
			} catch (error) {
				console.error(error)
			}
		},
		[filterGap]
	)
	// Извлекаем список дат
	const labels = useMemo<string[]>(() => {
		let res: string[] = []
		if (data) {
			for (const p of data.production) {
				res = res.concat(p.data.map(item => formatName(item.data)))
			}
		}
		return [...new Set(res)].filter(label => label.length < 12).sort()
	}, [data, formatName])
	// Извлекаем, групируем данные
	const ddata = useMemo(() => {
		const res: Array<{
			name: string
			value: number
			color: string
		}> = []

		if (data) {
			labels.forEach(label => {
				const newItem = {
					name: label,
					value: 0,
					color: randomColor(),
				}
				data.production.forEach(production => {
					if (
						cuurent_production > 0 &&
						cuurent_production !== production.production_id
					) {
						return
					}
					production.data.forEach(item => {
						if (formatName(item.data) === label) {
							newItem.value += item.count
						}
					})
				})

				res.push(newItem)
			})
		}
		return res.filter(item => item.value > 1000)
	}, [data, labels, cuurent_production])

	const isEmpty = useMemo(() => !ddata.length, [ddata])

	useEffect(() => {
		const send = async () => {
			setData((await sendRequest('p')).message)
		}
		send()
	}, [query])
	useEffect(() => {
		setQuery(props)
	}, [props])

	return (
		<div className='flex flex-col items-center justify-start gap-3 max-w-full max-h-full'>
			<h2 className='mb-3 w-full text-left'>Напечатано</h2>
			<div className='flex w-full gap-0 items-start justify-end'>
				<label className='flex'>
					<input
						type='checkbox'
						checked={filterGap}
						onChange={e => setFilterGap(e.target.checked)}
					/>
					<div className='ml-3'>Группировать по G</div>
				</label>
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
			<div className='w-full aspect-square'>
				<Loading active={isLoading}>
					{isEmpty ? (
						<span>Данные ненашлись!</span>
					) : (
						<ResponsiveContainer>
							<BarChart data={ddata}>
								<Tooltip />
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='name' />
								<YAxis />
								<Bar dataKey='value' fill='#8884d8' label={{ position: 'top' }}>
									{ddata.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					)}
				</Loading>
			</div>
		</div>
	)
})

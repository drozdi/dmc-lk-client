import { AspectRatio, Select, Stack } from '@mantine/core'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { ExpandablePanel } from '../../../shared/ui'
import { useAnalytics } from '../api/api'
import { mapEvent, mapEventColor } from '../entites/constants'

interface ChartAnalyticProps extends Omit<IAnalyticsQuery, 'event'> {}

export const AnalyticAllWidget = (props: ChartAnalyticProps) => {
	//return ''
	const { isLoading, request } = useAnalytics()
	const [cuurent_production, setCurrentProduction] = useState('0')
	const [data, setData] = useState<{
		v?: IAnalyticsResponse
		i?: IAnalyticsResponse
		d?: IAnalyticsResponse
		p?: IAnalyticsResponse
	}>({})
	const [query, setQuery] = useState<ChartAnalyticProps>({ ...props })

	async function sendRequest(event: IAnalyticsQuery['event']) {
		return await request({ ...query, event })
	}

	// Извлекаем список площадок
	const productions = useMemo<IProductionAnalytics[]>(() => {
		if (data) {
			return (((data?.v || data?.i || data?.d || data?.p)?.production as Array<IProductionAnalytics>) || []).map(
				item => ({
					value: String(item.production_id),
					label: item.name,
					address: item.address,
				})
			)
		}
		return []
	}, [data])
	// Извлекаем, групируем данные
	const ddata = useMemo(() => {
		const res = {
			v: { value: 0, color: mapEventColor.v },
			d: { value: 0, color: mapEventColor.d },
			i: { value: 0, color: mapEventColor.i },
		}
		const currProduction = Number(cuurent_production) || 0

		if (data) {
			for (const event in res) {
				if (currProduction > 0) {
					res[event].value =
						data[event].production?.find(item => item.production_id === currProduction)?.all_label_prod || 0
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

	const title = useMemo(() => {
		return (
			dayjs(query.filterdate_from).format('YYYY-MM-DD') + ' - ' + dayjs(query.filterdate_to || '').format('YYYY-MM-DD')
		)
	}, [query])

	return (
		<ExpandablePanel loading={isLoading} title={title}>
			<Stack h='100%'>
				<div>
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
				</div>

				<AspectRatio ratio={16 / 9}>
					{isEmpty ? (
						<span>Данные ненашлись!</span>
					) : (
						<ResponsiveContainer>
							<PieChart>
								<Tooltip />
								<Legend
									formatter={(_: string, entry: any) => {
										const { color, name, value } = entry.payload
										return (
											<span style={{ color }}>
												{name} - {value}
											</span>
										)
									}}
									layout='vertical'
									verticalAlign='middle'
									align='left'
								/>
								<Pie data={ddata} cx='50%' cy='50%' fill='#8884d8' dataKey='value'>
									{ddata.map((entry, index) => (
										<Cell key={`cell-${entry.name}`} fill={entry.color} />
									))}
								</Pie>
							</PieChart>
						</ResponsiveContainer>
					)}
				</AspectRatio>
			</Stack>
		</ExpandablePanel>
	)
}

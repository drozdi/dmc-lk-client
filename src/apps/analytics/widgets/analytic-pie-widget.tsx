import { AspectRatio, Select, Stack } from '@mantine/core'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { ExpandablePanel } from '../../../shared/ui'
import { useAnalytics } from '../api'
import { mapEvent, mapEventColor } from '../entites/constants'

interface ChartAnalyticProps extends Omit<IRequestAnalytics, 'event'> {}

export const AnalyticPieWidget = (props: ChartAnalyticProps) => {
	//return ''
	const { isLoading, request } = useAnalytics()
	const [cuurent_production, setCurrentProduction] = useState('0')
	const [data, setData] = useState<{
		v?: IResponseAnalytics
		i?: IResponseAnalytics
		d?: IResponseAnalytics
		p?: IResponseAnalytics
	}>({})
	const [query, setQuery] = useState<ChartAnalyticProps>({ ...props })

	async function sendRequest(event: IRequestAnalytics['event']) {
		return await request({ ...query, event })
	}

	// Извлекаем список площадок
	const productions = useMemo<IAnalyticsProductionSelect[]>(() => {
		if (data) {
			return (((data?.v || data?.i || data?.d || data?.p)?.production as Array<IAnalyticsProduction>) || []).map(
				item => ({
					value: String(item.production_id),
					label: item.name,
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
					res[event as 'v' | 'i' | 'd'].value =
						data?.[event as AnalyticEvent]?.production?.find(item => item.production_id === currProduction)
							?.all_label_prod || 0
				} else {
					res[event as 'v' | 'i' | 'd'].value = Number(data[event as AnalyticEvent]?.sum_company)
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

	const title = useMemo(() => {
		return (
			dayjs(query.filterdate_from).format('YYYY-MM-DD') + ' - ' + dayjs(query.filterdate_to || '').format('YYYY-MM-DD')
		)
	}, [query])

	return (
		<ExpandablePanel loading={isLoading} title={title}>
			<Stack h='100%'>
				<Select
					defaultValue={String(cuurent_production)}
					checkIconPosition='right'
					onChange={val => setCurrentProduction(val as string)}
					data={[
						{
							value: '0',
							label: 'Все площадки',
						},
					].concat(productions as any)}
				/>

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
									{ddata.map(entry => (
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

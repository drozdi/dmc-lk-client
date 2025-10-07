import { AspectRatio, Button, Checkbox, Group, Select, Stack } from '@mantine/core'
import dayjs from 'dayjs'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ExpandablePanel } from '../../../shared/ui'
import { randomColor } from '../../../shared/utils'
import { useAnalytics } from '../api/api'

interface ChartAnalyticProps extends Omit<IAnalyticsQuery, 'event'> {}

export const AnalyticTypeWidget = memo((props: ChartAnalyticProps) => {
	//return ''
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
			return ((data?.production as Array<IProductionAnalytics>) || []).map(item => ({
				address: item.address,
				label: item.name,
				value: String(item.production_id),
			}))
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
			for (const p of data?.production || []) {
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
		const currProduction = Number(cuurent_production || 0)

		if (data) {
			labels.forEach(label => {
				const newItem = {
					name: label,
					value: 0,
					color: randomColor(),
				}
				data.production.forEach(production => {
					if (currProduction > 0 && currProduction !== production.production_id) {
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
		return res.filter(item => item.value > 100)
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

	const title = useMemo(() => {
		return (
			dayjs(query.filterdate_from).format('YYYY-MM-DD') + ' - ' + dayjs(query.filterdate_to || '').format('YYYY-MM-DD')
		)
	}, [query])

	return (
		<ExpandablePanel loading={isLoading} title={title}>
			<Stack h='100%'>
				<Group gap='0'>
					<Checkbox onChange={e => setFilterGap(e.target.checked)} checked={filterGap} label='Группировать по G' />
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
				</AspectRatio>
			</Stack>
		</ExpandablePanel>
	)
})

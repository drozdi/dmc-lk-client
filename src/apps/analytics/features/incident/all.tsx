import { Accordion, Button, Center, Group, Text } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import dayjs from 'dayjs'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useQuery } from '../../../../shared/hooks'
import { Loading } from '../../../../shared/ui'
import { requestAnalyticsIncident } from '../../api'
import { Detail } from './components/detail'

export const AllIncident = observer(() => {
	const day = dayjs()
	const { isLoading, request } = useQuery(requestAnalyticsIncident)
	const [data, setData] = useState([])
	const [query, setQuery] = useState({
		limit_page: 1000,
		filterdate: [day.month(day.month() - 3).format('YYYY-MM-DD'), day.format('YYYY-MM-DD')],
		data: [],
		fields_name: [],
		details_field: [],
	})
	const handleDate = (index, date) => {
		if (index === 0) {
			setQuery(v => ({
				...v,
				filterdate: [date, v.filterdate?.[1]],
			}))
		} else {
			setQuery(v => ({
				...v,
				filterdate: [v.filterdate?.[0], date],
			}))
		}
	}

	async function fetch() {
		const res = await request(query)
		setData(res?.message)
	}
	useEffect(() => {
		if (query.filterdate.length) {
			fetch()
		}
	}, [])

	return (
		<div>
			<Group justify='end'>
				<Group justify='end' gap='xs'>
					<Text>С</Text>
					<DatePickerInput
						name='filterdate_from'
						value={query.filterdate?.[0] || ''}
						onChange={value => handleDate(0, value)}
					/>
					<Text>по</Text>
					<DatePickerInput
						name='filterdate_to'
						value={query.filterdate?.[1] || ''}
						onChange={value => handleDate(1, value)}
					/>
				</Group>
				<Button onClick={() => fetch()}>Применить</Button>
			</Group>
			<Loading active={isLoading} keepMounted>
				{data.length ? (
					<Accordion multiple chevronPosition='left'>
						{data.map((item, index) => (
							<Accordion.Item key={item.data} value={'tab' + item.data}>
								<Accordion.Control icon={item.total_counter}>{item.data}</Accordion.Control>
								<Accordion.Panel>
									<Detail {...query} data={[item.data]} />
								</Accordion.Panel>
							</Accordion.Item>
						))}
					</Accordion>
				) : (
					<Center w='100%' h='10rem' fz='h1'>
						пусто
					</Center>
				)}
			</Loading>
		</div>
	)
})

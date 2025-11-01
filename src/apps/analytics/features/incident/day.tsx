import { Table } from '@mantine/core'
import dayjs from 'dayjs'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useQuery } from '../../../../shared/hooks'
import { Loading } from '../../../../shared/ui'
import { requestAnalyticsIncident } from '../../api'
import { useFetchFields } from '../../api/hooks/use-fetch-fields'

export const IncidentDay = observer(({ day }: { day: string }) => {
	const { data: fields } = useFetchFields()

	const { isLoading, error, request } = useQuery(requestAnalyticsIncident)

	const [data, setData] = useState([])
	const [query, setQuery] = useState({
		limit_page: 1000,
		filterdate: [],
		data: [],
		fields_name: [
			'timestamp',
			'inn_company',
			'production_id',
			'taskid',
			'place_id',
			'place_name',
			'place_type',
			'device_id',
			'device_name',
			'device_type',
			'event_id',
			'event_name',
			'node_id',
			'node_name',
			'node_level',
			'data',
			'exported',
			'created',
			'company_id',
			'name_production',
			'address_production',
			'id_company',
			'kpp_company',
			'name_company',
			'address_company',
			'descriptions_company',
			'phone_company',
		],
		details_field: ['id', 'production_id', 'taskid', 'device_id', 'event_id', 'node_id', 'place_id'],
	})

	useEffect(() => {
		const currDay = dayjs(day)
		setQuery(v => ({
			...v,
			filterdate: [currDay.format('YYYY-MM-DD'), currDay.day(currDay.day() + 1).format('YYYY-MM-DD')],
		}))
	}, [day])

	useEffect(() => {
		//setQuery(v => ({ ...v, fields_name: list }))
	}, [fields])

	useEffect(() => {
		if (query.filterdate?.length) {
			request(query).then(data => {
				setData(data?.message || [])
			})
		}
	}, [query])

	return (
		<Loading active={isLoading} keepMounted>
			<Table>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Дата</Table.Th>
						<Table.Th>{fields?.place_name?.label}</Table.Th>
						<Table.Th>{fields?.device_name?.label}</Table.Th>
						<Table.Th>{fields?.event_name?.label}</Table.Th>
						<Table.Th>{fields?.node_name?.label}</Table.Th>
						<Table.Th w='35%'>Ошибка</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{data?.length ? (
						data.map((item: any, index: number) => (
							<Table.Tr key={item.id}>
								<Table.Td>{dayjs(item.timestamp).format('YYYY-MM-DD HH:mm')}</Table.Td>
								<Table.Td>{item.place_name}</Table.Td>
								<Table.Td>{item.device_name}</Table.Td>
								<Table.Td>{item.event_name}</Table.Td>
								<Table.Td>{item.node_name}</Table.Td>
								<Table.Td>
									{item.data} ({item.total_counter})
								</Table.Td>
							</Table.Tr>
						))
					) : (
						<Table.Tr>
							<Table.Td colSpan={6} ta='center' fz='h2' p='md'>
								Данные отсутствуют
							</Table.Td>
						</Table.Tr>
					)}
				</Table.Tbody>
			</Table>
		</Loading>
	)
})

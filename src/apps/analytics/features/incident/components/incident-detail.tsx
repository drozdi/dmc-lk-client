import { Button, Group, Table } from '@mantine/core'
import { useEffect, useMemo, useState } from 'react'
import { TbX } from 'react-icons/tb'
import { useQuery_ } from '../../../../../shared/hooks'
import { Loading } from '../../../../../shared/ui'
import { requestAnalyticsIncident } from '../../../api'

export function IncidentDetail(props: IRequestAnalyticsIncident) {
	const { isLoading, fetch, data } = useQuery_(['incident'], requestAnalyticsIncident, {
		select: (data: IResponse<IResponseAnalyticsIncident>) => data?.message || [],
	})

	const [{ name_production, production_id }, setProduction] = useState<{
		name_production: string
		production_id: number
	}>({
		name_production: '',
		production_id: 0,
	})

	const [query] = useState<IRequestAnalyticsIncident>({
		...props,
		fields_name: [
			...new Set([
				...(props.fields_name || []),
				'name_production',
				'address_production',
				'event_name',
				'device_name',
				'device_type',
				'node_name',
				'place_name',
			]),
		],
		details_field: [...new Set([...(props.details_field || []), 'production_id', 'device_id', 'node_id', 'place_id'])],
	})

	useEffect(() => {
		fetch?.(query)
	}, [query])

	const ddata = useMemo(() => {
		const res: Record<string, any> = {}

		if (production_id) {
			data?.forEach((item: IAnalyticsIncidentItem) => {
				if (item.production_id == production_id) {
					res[item.device_id] = {
						...item,
						total_counter: (res[item.device_id]?.total_counter || 0) + item.total_counter,
					}
				}
			})
			return Object.values(res).sort((a, b) => b.total_counter - a.total_counter)
		} else {
			data?.forEach((item: IAnalyticsIncidentItem) => {
				res[item.production_id] = {
					...item,
					total_counter: (res[item.production_id]?.total_counter || 0) + item.total_counter,
				}
			})
			return Object.values(res).sort((a, b) => b.total_counter - a.total_counter)
		}

		return data
	}, [data, production_id])

	async function handleProduction(production_id: number, name_production: string) {
		setProduction({
			name_production,
			production_id,
		})
	}

	return (
		<Loading mih='100' keepMounted active={isLoading}>
			<Group justify='center'>
				{production_id && (
					<Button color='red' variant='outline' onClick={() => handleProduction(0, '')} rightSection={<TbX />}>
						Площадка: {name_production}
					</Button>
				)}
			</Group>
			<Table highlightOnHover={!Boolean(production_id)}>
				<Table.Tbody>
					{production_id ? (
						<>
							<Table.Tr>
								<Table.Th colSpan={2} ta='center'>
									Устройства
								</Table.Th>
							</Table.Tr>

							{ddata.map((item: IAnalyticsIncidentItem) => (
								<Table.Tr key={item.device_id}>
									<Table.Td>{item.device_name}</Table.Td>
									<Table.Td>{item.total_counter}</Table.Td>
								</Table.Tr>
							))}
						</>
					) : (
						<>
							<Table.Tr>
								<Table.Th colSpan={3} ta='center'>
									Площадки
								</Table.Th>
							</Table.Tr>
							{ddata.map((item: IAnalyticsIncidentItem) => (
								<Table.Tr
									className='cursor-pointer'
									key={item.production_id}
									onClick={() => handleProduction(item.production_id, item.name_production)}
								>
									<Table.Td>{item.name_production}</Table.Td>
									<Table.Td>{item.address_production}</Table.Td>
									<Table.Td>{item.total_counter}</Table.Td>
								</Table.Tr>
							))}
						</>
					)}
				</Table.Tbody>
			</Table>
		</Loading>
	)
}

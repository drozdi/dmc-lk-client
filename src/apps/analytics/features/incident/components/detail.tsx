import { useEffect, useMemo, useState } from 'react'
import { TbX } from 'react-icons/tb'
import { useQuery } from '../../../../../shared/hooks'
import {
	DmcBtn,
	DmcItem,
	DmcItemLabel,
	DmcItemSection,
	DmcList,
	DmcLoading,
} from '../../../../../shared/ui'
import { requestAnalyticsIncident } from '../../../api'

export function Detail(props) {
	const { isLoading, request } = useQuery(requestAnalyticsIncident)
	const [data, setData] = useState([])

	const [{ name_production, production_id }, setProduction] = useState({
		name_production: '',
		production_id: '',
	})

	const [query, setQuery] = useState({
		...props,
		fields_name: [
			...new Set([
				...props.details_field,
				'name_production',
				'address_production',
				'event_name',
				'device_name',
				'device_type',
				'node_name',
				'place_name',
			]),
		],
		details_field: [
			...new Set([
				...props.details_field,
				'production_id',
				'device_id',
				'node_id',
				'place_id',
			]),
		],
	})

	async function fetch() {
		const res = await request(query)
		setData(res.message)
	}
	useEffect(() => {
		fetch()
	}, [query])

	const ddata = useMemo(() => {
		const res = {}

		if (production_id) {
			data.forEach(item => {
				if (item.production_id == production_id) {
					res[item.device_id] = {
						...item,
						total_counter:
							(res[item.device_id]?.total_counter || 0) + item.total_counter,
					}
				}
			})
			return Object.values(res).sort(
				(a, b) => b.total_counter - a.total_counter
			)
		} else {
			data.forEach(item => {
				res[item.production_id] = {
					...item,
					total_counter:
						(res[item.production_id]?.total_counter || 0) + item.total_counter,
				}
			})
			return Object.values(res).sort(
				(a, b) => b.total_counter - a.total_counter
			)
		}

		return data
	}, [data, production_id])

	async function handleProduction(production_id, name_production) {
		setProduction({
			name_production,
			production_id,
		})
	}

	return (
		<DmcLoading keepMounted active={isLoading}>
			<div className='flex mt-3 gap-3 justify-center'>
				{production_id && (
					<DmcBtn
						color='warning'
						size='sm'
						outline
						onClick={() => setProduction(0, '')}
						rightSection={<TbX />}
					>
						Плозадка: {name_production}
					</DmcBtn>
				)}
			</div>
			<DmcList as='div' className='p-6'>
				{production_id ? (
					<>
						<DmcItemLabel header>Устройства</DmcItemLabel>
						{ddata.map((item, index) => (
							<DmcItem key={item.device_id}>
								<DmcItemSection>
									<DmcItemLabel>{item.device_name}</DmcItemLabel>
								</DmcItemSection>
								<DmcItemSection side>
									<DmcItemLabel>{item.total_counter}</DmcItemLabel>
								</DmcItemSection>
							</DmcItem>
						))}
					</>
				) : (
					<>
						<DmcItemLabel header>Площадки</DmcItemLabel>
						{ddata.map((item, index) => (
							<DmcItem
								key={item.production_id}
								onClick={() =>
									handleProduction(item.production_id, item.name_production)
								}
							>
								<DmcItemSection>
									<DmcItemLabel>{item.name_production}</DmcItemLabel>
								</DmcItemSection>
								<DmcItemSection>
									<DmcItemLabel>{item.address_production}</DmcItemLabel>
								</DmcItemSection>
								<DmcItemSection side>
									<DmcItemLabel>{item.total_counter}</DmcItemLabel>
								</DmcItemSection>
							</DmcItem>
						))}
					</>
				)}
			</DmcList>
		</DmcLoading>
	)
}

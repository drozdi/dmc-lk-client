import { useEffect, useMemo, useState } from 'react'
import {
	DmcItem,
	DmcItemLabel,
	DmcItemSection,
	DmcList,
} from '../../../../../shared/ui'
import { requestAnalyticsIncident } from '../../../api'

export function Detail(props) {
	const [data, setData] = useState([])
	const [production_id, setProduction_id] = useState(0)
	const [query, setQuery] = useState({
		...props,
		fields_name: [
			...new Set([
				...props.details_field,
				'name_production',
				'event_name',
				'device_name',
			]),
		],
		details_field: [
			...new Set([...props.details_field, 'production_id', 'device_id']),
		],
	})
	async function fetch() {
		const res = await requestAnalyticsIncident(query)
		setData(res.message)
		console.log(res)
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
				return Object.values(res).sort(
					(a, b) => b.total_counter - a.total_counter
				)
			})
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

	async function handleProduction(production_id) {}

	return (
		<DmcList as='div' className='p-6'>
			{ddata.map((item, index) => (
				<DmcItem
					key={index}
					onClick={() => handleProduction(item.production_id)}
				>
					<DmcItemSection>
						<DmcItemLabel>{item.name_production}</DmcItemLabel>
					</DmcItemSection>
					<DmcItemSection side>
						<DmcItemLabel>{item.total_counter}</DmcItemLabel>
					</DmcItemSection>
				</DmcItem>
			))}
		</DmcList>
	)
}

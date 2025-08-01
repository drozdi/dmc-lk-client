import { useEffect } from 'react'
import { useParams } from 'react-router'
import { useQuery } from '../../../shared/hooks'
import { DmcLoading } from '../../../shared/ui'
import { requestAnalyticsGetQuery } from '../api'
import { TableElastic } from '../features/elastic/table'
import { elasticStore } from '../stores/elastic-store'

export function AnalyticsQueryPage() {
	const { isLoading, request } = useQuery(requestAnalyticsGetQuery)
	const { id_query } = useParams()
	const fetcQuery = async () => {
		const { id, name_query, ...template } = await request(id_query)
		elasticStore.saveTemp(template)
		elasticStore.setName(name_query)
		elasticStore.setId(id)
	}
	useEffect(() => {
		fetcQuery()
	}, [])
	return (
		<>
			<DmcLoading active={isLoading} keepMounted>
				<TableElastic />
			</DmcLoading>
		</>
	)
}

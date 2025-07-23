import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Loading } from '../../../shared/ui'
import { requestAnalyticsGetQuery } from '../api'
import { TableElastic } from '../features/elastic/table'
import { elasticStore } from '../stores/elastic-store'

export function AnalyticsQueryPage() {
	const [isLoading, setIsLoading] = useState(true)
	const { id_query } = useParams()
	const fetcQuery = async () => {
		const { id, name_query, ...template } = await requestAnalyticsGetQuery(
			id_query
		)
		elasticStore.saveTemp(template)
		elasticStore.setName(name_query)
		elasticStore.setId(id)
		setIsLoading(false)
	}
	useEffect(() => {
		fetcQuery()
	}, [])
	return (
		<>
			<Loading active={isLoading}>
				<TableElastic />
			</Loading>
		</>
	)
}

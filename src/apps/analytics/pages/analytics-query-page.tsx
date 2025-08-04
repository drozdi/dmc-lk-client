import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useQuery } from '../../../shared/hooks'
import { DmcLoading, DmcSelect } from '../../../shared/ui'
import { requestAnalyticsGetQuery } from '../api'
import { TableElastic } from '../features/elastic/table'
import { elasticStore } from '../stores/elastic-store'

export const AnalyticsQueryPage = observer(() => {
	const { list } = elasticStore
	const navigate = useNavigate()

	const { isLoading, request } = useQuery(requestAnalyticsGetQuery)
	const { id_query } = useParams()
	const fetcQuery = async () => {
		const { id, name_query, ...template } = await request(id_query)
		elasticStore.saveTemp(template)
		elasticStore.setName(name_query)
		elasticStore.setId(id)
	}
	const goTo = id => {
		navigate(`/analytics/query/${id}`)
	}
	useEffect(() => {
		fetcQuery()
	}, [id_query])

	return (
		<>
			<DmcSelect
				filled
				underlined
				value={id_query}
				onChange={({ target }) => goTo(target.value)}
			>
				{list.map(({ id, name_query }) => (
					<option key={id} value={id}>
						{name_query}
					</option>
				))}
			</DmcSelect>
			<DmcLoading active={isLoading} keepMounted>
				<TableElastic />
			</DmcLoading>
		</>
	)
})

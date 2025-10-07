import { Select } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useQuery } from '../../../shared/hooks'
import { Loading } from '../../../shared/ui'
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
			<Select
				value={String(id_query)}
				onChange={value => goTo(value)}
				data={list.map(({ id, name_query }) => ({
					value: String(id),
					label: name_query,
				}))}
			/>
			<Loading active={isLoading} keepMounted mt='xs'>
				<TableElastic />
			</Loading>
		</>
	)
})

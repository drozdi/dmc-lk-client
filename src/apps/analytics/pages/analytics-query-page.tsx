import { Paper, Select } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TemplateTitle } from '../../../layout'
import { useQuery } from '../../../shared/hooks'
import { Loading } from '../../../shared/ui'
import { requestAnalyticsQueriesGet } from '../api'
import { TableElastic } from '../features/elastic/table'
import { elasticStore } from '../stores/elastic-store'

export const AnalyticsQueryPage = observer(() => {
	const { list } = elasticStore
	const [name, setName] = useState('')
	const navigate = useNavigate()

	const { isLoading, request } = useQuery(requestAnalyticsQueriesGet)
	const { id_query } = useParams()
	const fetcQuery = async () => {
		const { id, name_query, ...template } = await request(id_query)
		setName(name_query)
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
		<Paper>
			<Select
				value={String(id_query)}
				onChange={value => goTo(value)}
				data={list.map(({ id, name_query }) => ({
					value: String(id),
					label: name_query,
				}))}
			/>
			<TemplateTitle>Запрос "{name}"</TemplateTitle>
			<Loading active={isLoading} keepMounted mt='xs'>
				<TableElastic />
			</Loading>
		</Paper>
	)
})

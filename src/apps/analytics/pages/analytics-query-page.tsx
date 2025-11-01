import { Paper, Select } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TemplateTitle } from '../../../layout'
import { Loading } from '../../../shared/ui'
import { useFetchQueries, useFetchQuery } from '../api/hooks/queries'
import { TableElastic } from '../features/elastic/table'
import { elasticStore } from '../stores/elastic-store'

export const AnalyticsQueryPage = observer(() => {
	const [name, setName] = useState('')
	const navigate = useNavigate()

	const { id_query } = useParams()
	const { data: list } = useFetchQueries()
	const { data, isLoading } = useFetchQuery(Number(id_query))

	useEffect(() => {
		if (!data) {
			return
		}
		const { id, name_query, ...template } = data
		setName(name_query)
		elasticStore.saveTemp(template)
		elasticStore.setName(name_query)
		elasticStore.setId(id)
	}, [data])

	const goTo = id => {
		navigate(`/analytics/query/${id}`)
	}

	return (
		<Paper>
			<Select
				value={String(id_query)}
				onChange={value => goTo(value)}
				data={(list || []).map(({ id, name_query }) => ({
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

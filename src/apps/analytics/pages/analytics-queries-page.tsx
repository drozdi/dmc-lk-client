import { Paper } from '@mantine/core'
import { TemplateTitle } from '@t'
import { useNavigate } from 'react-router-dom'
import { ListQueries } from '../features/queries/list-queries'

export function AnalyticsQueriesPage() {
	const navigate = useNavigate()
	return (
		<Paper>
			<TemplateTitle fz='h2' ta='center'>
				Список запросов
			</TemplateTitle>
			<ListQueries />
		</Paper>
	)
}

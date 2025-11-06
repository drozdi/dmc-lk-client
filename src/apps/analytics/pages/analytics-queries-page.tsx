import { Paper } from '@mantine/core'
import { Template } from '@t'
import { useNavigate } from 'react-router-dom'
import { ListQueries } from '../features/queries/list-queries'

export function AnalyticsQueriesPage() {
	const navigate = useNavigate()
	return (
		<Paper>
			<Template.Title fz='h2' ta='center'>
				Список запросов
			</Template.Title>
			<ListQueries />
		</Paper>
	)
}

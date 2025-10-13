import { Text } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { ListQueries } from '../features/queries/list-queries'

export function AnalyticsQueriesPage() {
	const navigate = useNavigate()
	return (
		<>
			<Text fz='h2' ta='center'>
				Список запросов
			</Text>
			<ListQueries />
		</>
	)
}

import { Paper } from '@mantine/core'
import { Template } from '../../../layout'
import { ListQueries } from '../features/queries/list-queries'

export function AnalyticsQueriesPage() {
	return (
		<Paper>
			<Template.Title fz='h2' ta='center'>
				Список запросов
			</Template.Title>
			<ListQueries />
		</Paper>
	)
}

import { Button } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { Template } from '../../../components/context'
import { ListQueries } from '../features/queries/list-queries'

export function AnalyticsQueriesPage() {
	const navigate = useNavigate()
	return (
		<>
			<h2 className='text-2xl text-center mb-3'>Список запросов</h2>
			<ListQueries />
			<Template slot='footer'>
				<Button onClick={() => navigate('/analytics/elastic')}>Добавить</Button>
			</Template>
		</>
	)
}

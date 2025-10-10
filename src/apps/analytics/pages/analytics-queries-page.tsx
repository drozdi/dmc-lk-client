import { useNavigate } from 'react-router-dom'

import { ListQueries } from '../features/queries/list-queries'

export function AnalyticsQueriesPage() {
	const navigate = useNavigate()
	return (
		<>
			<h2 className='text-2xl text-center mb-3'>Список запросов</h2>
			<ListQueries />
		</>
	)
}

import { Link } from 'react-router-dom'
import { Template } from '../../../layout/context'
import { Btn } from '../../../shared/ui'
import { ListQueries } from '../features/queries/list-queries'
export function AnalyticsQueriesPage() {
	return (
		<>
			<h2 className='text-2xl text-center mb-3'>Список запросов</h2>
			<ListQueries />
			<Template slot='footer'>
				<div className='flex w-full justify-end'>
					<Btn as={Link} to='/analytics/elastic'>
						Добавить
					</Btn>
				</div>
			</Template>
		</>
	)
}

import { Template } from '../../../components/context'
import { DmcBtn } from '../../../shared/ui'
import { ListQueries } from '../features/queries/list-queries'
export function AnalyticsQueriesPage() {
	return (
		<>
			<h2 className='text-2xl text-center mb-3'>Список запросов</h2>
			<ListQueries />
			<Template slot='footer'>
				<DmcBtn size='sm' color='info' to='/analytics/elastic'>
					Добавить
				</DmcBtn>
			</Template>
		</>
	)
}

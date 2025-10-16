import { Outlet } from 'react-router-dom'
import { AnalyticsElasticPage } from './pages/analytics-elastic-page'
import { AnalyticsIncidentDayPage } from './pages/analytics-incident-day-page'
import { AnalyticsIncidentFilterPage } from './pages/analytics-incident-filter-page'
import { AnalyticsIncidentListPage } from './pages/analytics-incident-list-page'
import { AnalyticsPage } from './pages/analytics-page'
import { AnalyticsQueriesPage } from './pages/analytics-queries-page'
import { AnalyticsQueryPage } from './pages/analytics-query-page'

export default function ({ path = '/analytics' }: AppRouterProps = {}): object {
	return {
		path: path,
		element: <Outlet />,
		children: [
			{
				path: '',
				element: <AnalyticsPage />,
			},
			{
				path: 'elastic',
				element: <AnalyticsElasticPage />,
			},
			{
				path: 'queries',
				element: <AnalyticsQueriesPage />,
			},
			{
				path: 'query/:id_query',
				element: <AnalyticsQueryPage />,
			},
			{
				path: 'incident',
				element: <AnalyticsIncidentFilterPage />,
			},
			{
				path: 'incident/list',
				element: <AnalyticsIncidentListPage />,
			},
			{
				path: 'incident/day',
				element: <AnalyticsIncidentDayPage />,
			},
		],
	}
}

import { Outlet } from 'react-router-dom'
import { AnalyticsElasticPage } from './pages/analytics-elastic-page'
import { AnalyticsIncidentPage } from './pages/analytics-incident-page'
import { AnalyticsPage } from './pages/analytics-page'

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
				path: 'incident',
				element: <AnalyticsIncidentPage />,
			},
		],
	}
}

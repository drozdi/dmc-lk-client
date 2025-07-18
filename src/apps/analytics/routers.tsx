import { AnalyticsPage } from './pages/analytics-page'

export default function ({ path = '/analytics' }: AppRouterProps): object {
	return {
		path: path,
		element: <AnalyticsPage />,
	}
}

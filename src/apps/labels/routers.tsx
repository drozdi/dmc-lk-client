import { Outlet } from 'react-router'
import { LabelsCountPage } from './pages/lables-count-page'
import { LabelsPage } from './pages/lables-page'

export default function ({ path = '/labels' }: AppRouterProps = {}): object {
	return {
		path: path,
		element: <Outlet />,
		children: [
			{
				path: '',
				element: <LabelsPage />,
			},
			{
				path: 'count',
				element: <LabelsCountPage />,
			},
		],
	}
}

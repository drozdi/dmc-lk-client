import { Outlet } from 'react-router'
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
		],
	}
}

import { Outlet } from 'react-router-dom'
import { BtnPage } from './pages/btn-page'
import { IndexPage } from './pages/index-page'
import { InputPage } from './pages/input-page'
import { ListPage } from './pages/list-page'

export default function ({ path = '/ui' }: AppRouterProps = {}): object {
	return {
		path: path,
		element: <Outlet />,
		children: [
			{
				path: '',
				element: <IndexPage />,
			},
			{
				path: 'btn',
				element: <BtnPage />,
			},
			{
				path: 'list',
				element: <ListPage />,
			},
			{
				path: 'input',
				element: <InputPage />,
			},
		],
	}
}

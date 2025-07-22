import { Outlet } from 'react-router'
import { ShopGroupPage } from './pages/shop-group-page'

export default function ({ path = '/shop' }: AppRouterProps = {}): object {
	return {
		path: path,
		element: <Outlet />,
		children: [
			{
				path: '',
				element: <ShopGroupPage />,
			},
			{
				path: 'group/:groupId',
				element: <ShopGroupPage />,
			},
		],
	}
}

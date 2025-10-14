import { Outlet } from 'react-router-dom'
import { UserPage } from './pages/user-page'
import { UsersPage } from './pages/users-page'

export default function ({ path = '/users' }: AppRouterProps = {}): object {
	return {
		path: path,
		element: <Outlet />,
		children: [
			{
				path: '',
				element: <UsersPage />,
			},
			{
				path: ':userId',
				element: <UserPage />,
			},
		],
	}
}

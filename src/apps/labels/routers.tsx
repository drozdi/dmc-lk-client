import { Outlet } from 'react-router'

export default function ({ path = '/label' }: AppRouterProps = {}): object {
	return {
		path: path,
		element: <Outlet />,
		children: [],
	}
}

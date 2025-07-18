import { Navigate, Outlet, useRoutes } from 'react-router'
import { AuthLayout } from '../layout/AuthLayout'
import { MainLayout } from '../layout/MainLayout'

import { SignInPage } from '../components/pages/auth/sign-in'
import { SignUpPage } from '../components/pages/auth/sign-up'
import { VerificatinPage } from '../components/pages/auth/verification'
import { PersonalPage } from '../components/pages/lk/personal-page'

import { ProtectedRoute } from '../components/features/protected-router/protected-route'

import { AnalyticsPage } from '../apps/analytics/pages/analytics-page'
import { ShopGroupPage } from '../apps/shop/pages/shop-group-page'

const routes = () => [
	{
		path: '/auth',
		element: <AuthLayout />,
		children: [
			{
				path: '',
				element: <Navigate to='/auth/sign-in' />,
			},
			{
				path: 'verificatin',
				element: <VerificatinPage />,
			},
			{
				path: 'sign-in',
				element: <SignInPage />,
			},
			{
				path: 'sign-up',
				element: <SignUpPage />,
			},
			{
				path: 'sign-out',
				element: 'sign-out',
			},
		],
	},
	{
		path: '/',
		element: (
			<ProtectedRoute>
				<MainLayout />
			</ProtectedRoute>
		),
		children: [
			{
				path: '',
				element: 'Hello World!',
			},
			{
				path: '/lk',
				element: <PersonalPage />,
			},
			{
				path: '/analytics',
				element: <AnalyticsPage />,
			},
			{
				path: '/shop',
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
			},
		],
	},
]

export function AppRouters() {
	const routesElement = useRoutes(routes())
	return routesElement
}

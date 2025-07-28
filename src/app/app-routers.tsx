import { Navigate, useRoutes } from 'react-router'
import { AuthLayout } from '../components/layout/AuthLayout'
import { MainLayout } from '../components/layout/MainLayout'

import { ProtectedRoute } from '../components/features/protected-router/protected-route'

import { PersonalPage } from '../pages/personal-page'
import { SignInPage } from '../pages/sign-in-page'
import { SignUpPage } from '../pages/sign-up-page'
import { VerificatinPage } from '../pages/verification-page'

import analyticsRouers from '../apps/analytics/routers'
import labelsRouers from '../apps/labels/routers'
import shopRouers from '../apps/shop/routers'
import uiRouters from '../apps/ui/routers'
import usersRouers from '../apps/users/routers'

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
			analyticsRouers(),
			shopRouers(),
			usersRouers(),
			labelsRouers(),
			uiRouters(),
		],
	},
]

export function AppRouters() {
	const routesElement = useRoutes(routes())
	return routesElement
}

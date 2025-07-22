import { Navigate, useRoutes } from 'react-router'
import { AuthLayout } from '../layout/AuthLayout'
import { MainLayout } from '../layout/MainLayout'

import { SignInPage } from '../components/pages/auth/sign-in'
import { SignUpPage } from '../components/pages/auth/sign-up'
import { VerificatinPage } from '../components/pages/auth/verification'
import { PersonalPage } from '../components/pages/lk/personal-page'

import { ProtectedRoute } from '../components/features/protected-router/protected-route'

import analyticsRouers from '../apps/analytics/routers'
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
			uiRouters(),
		],
	},
]

export function AppRouters() {
	const routesElement = useRoutes(routes())
	return routesElement
}

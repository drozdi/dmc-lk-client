import { Route, Routes } from 'react-router-dom'
import { AuthLayout } from '../layout/AuthLayout'
import { MainLayout } from '../layout/MainLayout'
import { SignInPage } from '../pages/auth/sign-in'
import { SignUpPage } from '../pages/auth/sign-up'

export function AppRouters() {
	return (
		<Routes>
			<Route path='/' element={<MainLayout />}>
				<Route path='' element='Hello World!' />
			</Route>
			<Route path='/auth' element={<AuthLayout />}>
				<Route path='sign-in' element={<SignInPage />} />
				<Route path='sign-up' element={<SignUpPage />} />
				<Route path='sign-out' element='sign-out' />
			</Route>
		</Routes>
	)
}

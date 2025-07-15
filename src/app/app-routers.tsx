import { Route, Routes } from 'react-router-dom'
import { AuthLayout } from '../layout/AuthLayout'
import { MainLayout } from '../layout/MainLayout'
import { AnalyticsPage } from '../pages/analytics/AnalyticsPage'
import { SignInPage } from '../pages/auth/sign-in'
import { SignUpPage } from '../pages/auth/sign-up'
import { VerificatinPage } from '../pages/auth/verification'
import { PersonalPage } from '../pages/lk/PersonalPage'

export function AppRouters() {
	return (
		<Routes>
			<Route path='/auth' element={<AuthLayout />}>
				<Route path='verificatin' element={<VerificatinPage />} />
				<Route path='sign-in' element={<SignInPage />} />
				<Route path='sign-up' element={<SignUpPage />} />
				<Route path='sign-out' element='sign-out' />
			</Route>
			<Route path='/' element={<MainLayout />}>
				<Route path='' element='Hello World!' />
				<Route path='/analytics' element={<AnalyticsPage />} />
				<Route path='/lk' element={<PersonalPage />} />
			</Route>
		</Routes>
	)
}

import { Navigate, Outlet, Route, Routes } from 'react-router'
import { ProtectedRoute } from '../features/protected-router/protected-route'
import { AuthLayout } from '../layout/AuthLayout'
import { MainLayout } from '../layout/MainLayout'
import { AnalyticsPage } from '../pages/analytics/analytics-page'
import { SignInPage } from '../pages/auth/sign-in'
import { SignUpPage } from '../pages/auth/sign-up'
import { VerificatinPage } from '../pages/auth/verification'
import { PersonalPage } from '../pages/lk/personal-page'
import { ShopGroupPage } from '../pages/shop/shop-group-page'

export function AppRouters() {
	return (
		<Routes>
			<Route path='/auth' element={<AuthLayout />}>
				<Route path='' element={<Navigate to='/auth/sign-in' />} />
				<Route path='verificatin' element={<VerificatinPage />} />
				<Route path='sign-in' element={<SignInPage />} />
				<Route path='sign-up' element={<SignUpPage />} />
				<Route path='sign-out' element='sign-out' />
			</Route>
			<Route
				path='/'
				element={
					<ProtectedRoute>
						<MainLayout />
					</ProtectedRoute>
				}
			>
				<Route path='' element='Hello World!' />
				<Route path='/analytics' element={<AnalyticsPage />} />
				<Route path='/lk' element={<PersonalPage />} />
				<Route path='/shop' element={<Outlet />}>
					<Route path='' element={<ShopGroupPage />} />
					<Route path='group/:groupId' element={<ShopGroupPage />} />
					<Route path='product/:groupId' element={<ShopGroupPage />} />
				</Route>
			</Route>
		</Routes>
	)
}

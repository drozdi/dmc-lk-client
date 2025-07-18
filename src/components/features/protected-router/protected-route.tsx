import { Navigate } from 'react-router'
import { authStore } from '../../stores/auth-store'

interface ProtectedRouteProps {
	children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
	if (!authStore.isAuthenticated) {
		return <Navigate to='/auth/sign-in' replace />
	}
	return children
}

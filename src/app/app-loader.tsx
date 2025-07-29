import { useEffect } from 'react'

import { authStore } from '../components/stores/auth-store'
import { userStore } from '../components/stores/user-store'

interface AppLoaderProps {
	children: React.ReactNode
}
export function AppLoader({ children }: AppLoaderProps) {
	useEffect(() => {
		if (authStore.isAuthenticated) {
			userStore.fetch()
		} else {
			userStore.reset()
		}
	}, [authStore.isAuthenticated])
	return children
}

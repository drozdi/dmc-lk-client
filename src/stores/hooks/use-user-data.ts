import { useMemo } from 'react'
import { userStore } from '../user-store'
export function useUserData(prop?: string) {
	return useMemo(() => {
		if (prop) {
			return userStore.userData?.[prop] || undefined
		}
		return userStore.userData
	}, [userStore.userData, prop])
}

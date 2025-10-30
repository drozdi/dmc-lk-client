import { useQuery } from '@tanstack/react-query'
import { requestUsersGet } from '../request'

export function useFetchUser(id: number | string) {
	return useQuery({
		queryKey: ['users', String(id)],
		queryFn: async () => await requestUsersGet(id),
		enabled: Boolean(id),
	})
}

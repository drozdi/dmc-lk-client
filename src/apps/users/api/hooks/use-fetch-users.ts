import { useQuery } from '@tanstack/react-query'
import { requestUsersList } from '../request'

export function useFetchUsers({ size = 15, number = 0 }: { size?: number; number?: number } = {}) {
	return useQuery({
		queryKey: ['users', size, number],
		queryFn: async () => await requestUsersList({ size, number }),
	})
}

import { useQuery } from '@tanstack/react-query'
import { requestUsersList } from '../request'

export function useFetchUsers({ size = 15, number = 0 }: { size?: number; number?: number } = {}) {
	return useQuery({
		queryKey: ['users', { size, number }],
		queryFn: async () => {
			const res = await requestUsersList({ size, number })
			if (!res.success) {
				throw new Error(res.message || 'Список пользователей: подумать над ошибкой!')
			}
			return res
		},
		select(data) {
			return data.data.request
		},
	})
}

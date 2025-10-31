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
		initialData: {
			success: false,
			message: 'Список пользователей пустой',
			data: {
				page: 1,
				next_page: 2,
				previous_page: 0,
				size: 0,
				request: [],
			},
		},
		// structuralSharing(oldData, newData) {
		// 	console.log(oldData, newData)
		// 	return newData
		// },
		select(data) {
			return data.data.request
		},
	})
}

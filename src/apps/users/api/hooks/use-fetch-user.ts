import { useQuery, useQueryClient } from '@tanstack/react-query'
import { requestUsersGet } from '../request'

export function useFetchUser(id: number | string) {
	const queryClient = useQueryClient()
	return useQuery({
		queryKey: ['users', id],
		staleTime: 0,
		queryFn: async () => {
			try {
				const res = await requestUsersGet(id)
				return res
			} catch (error) {
				const mes = `Ошибка запроса на получение пользователя с id ${id}: ${error.response.data.detail}`
				console.error(mes)
				throw new Error(mes)
			}
			return {}
		},
		// initialData: () => {
		// 	const users = queryClient.getQueryData(['users']);
		//     return users?.find((user) => user.id === id);
		// }
		select(data) {
			return data.data
		},
	})
}

import { useQuery } from '@tanstack/react-query'
import { requestUsersGet } from '../request'

export function useFetchUser(id: number | string) {
	return useQuery({
		queryKey: ['users', String(id)],
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
		initialData: {
			success: false,
			message: null,
			data: {
				id: 0,
				first_name: '',
				last_name: '',
				father_name: '',
				email: '',
				phone: '',
				is_active: true,
				is_superuser: false,
				id_production: [],
			},
		},
		select(data) {
			return data.data
		},
	})
}

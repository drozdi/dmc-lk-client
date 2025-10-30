import { useMutation, useQueryClient } from '@tanstack/react-query'
import { requestUsersUpdate } from '../request'

export function useEditUser() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async (data: IUsersUser) => await requestUsersUpdate(data.id, data),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['users', data.id] })
		},
	})
}

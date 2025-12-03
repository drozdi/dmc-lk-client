import { useMutation, useQueryClient } from '@tanstack/react-query'
import { requestUsersUpdate } from '../request'

export function useEditUser() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async ({ id, ...data }: IUsersUser) => await requestUsersUpdate(id, data),
		onSuccess: (data, ...args) => {
			console.log('onSuccess', data, args)
			queryClient.removeQueries({ queryKey: ['users'] })
		},
	})
}

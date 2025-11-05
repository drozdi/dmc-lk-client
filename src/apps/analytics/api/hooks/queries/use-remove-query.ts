import { useMutation, useQueryClient } from '@tanstack/react-query'
import { requestAnalyticsQueriesDelete } from '../../queries'

export function useRemoveQuery() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async (id: number) => {
			return await requestAnalyticsQueriesDelete(id)
		},
		onSuccess: (...args) => {
			console.log('useRemoveQueries', args)
			queryClient.removeQueries({ queryKey: ['query_users'] })
		},
	})
}

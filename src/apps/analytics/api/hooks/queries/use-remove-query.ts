import { useMutation, useQueryClient } from '@tanstack/react-query'
import { requestAnalyticsQueriesDelete } from '../../queries'

export function useRemoveQuery() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async (id: number) => {
			return await requestAnalyticsQueriesDelete(id)
		},
		onSuccess: data => {
			console.log('useRemoveQueries', data)
			queryClient.removeQueries({ queryKey: ['query_users'] })
		},
	})
}

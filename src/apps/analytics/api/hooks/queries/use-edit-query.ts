import { useMutation, useQueryClient } from '@tanstack/react-query'
import { requestAnalyticsQueriesUpdate } from '../../queries'

export function useEditQuery() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async (id, name, template) => {
			return await requestAnalyticsQueriesUpdate(id, name, template)
		},
		onSuccess: data => {
			console.log('useNewQueries', data)
			queryClient.removeQueries({ queryKey: ['query_users'] })
		},
	})
}

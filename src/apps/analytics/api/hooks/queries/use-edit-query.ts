import { useMutation, useQueryClient } from '@tanstack/react-query'
import { requestAnalyticsQueriesUpdate } from '../../queries'

export function useEditQuery() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async ({ id, name, template }: { id: number; name: string; template: IAnalyticsElasticQuery }) => {
			return await requestAnalyticsQueriesUpdate(id, name, template)
		},
		onSuccess: () => {
			queryClient.removeQueries({ queryKey: ['query_users'] })
		},
	})
}

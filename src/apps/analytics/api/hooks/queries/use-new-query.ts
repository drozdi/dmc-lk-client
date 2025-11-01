import { useMutation, useQueryClient } from '@tanstack/react-query'
import { requestAnalyticsQueriesAdd } from '../../queries'

export function useNewQuery() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async (name: string, template: IAnalyticsElasticQuery): Promise<any> => {
			return await requestAnalyticsQueriesAdd(name, template)
		},
		onSuccess: data => {
			console.log('useNewQueries', data)
			queryClient.removeQueries({ queryKey: ['query_users'] })
		},
	})
}

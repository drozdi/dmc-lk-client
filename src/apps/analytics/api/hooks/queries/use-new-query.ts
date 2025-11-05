import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { requestAnalyticsQueriesAdd } from '../../queries'

export function useNewQuery() {
	const queryClient = useQueryClient()
	const navigate = useNavigate()
	return useMutation({
		mutationFn: async ({ name, template }: { name: string; template: IAnalyticsElasticQuery }): Promise<any> => {
			return await requestAnalyticsQueriesAdd(name, template)
		},
		onSuccess: ({ data }) => {
			queryClient.removeQueries({ queryKey: ['query_users'] })
			navigate(`/analytics/query/${data.id}`)
		},
	})
}

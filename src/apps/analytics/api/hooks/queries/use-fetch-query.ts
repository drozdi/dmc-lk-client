import { useQuery } from '@tanstack/react-query'
import { requestAnalyticsQueriesGet } from '../../queries'

export function useFetchQuery(id: number) {
	return useQuery({
		queryKey: ['query_users', Number(id)],
		queryFn: async () => {
			return await requestAnalyticsQueriesGet(id)
		},
		select(data) {
			return data.data
		},
	})
}

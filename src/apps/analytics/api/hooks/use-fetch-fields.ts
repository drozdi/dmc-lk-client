import { useQuery } from '@tanstack/react-query'
import { requestAnalyticsFields } from '../fields'

export function useFetchFields() {
	return useQuery({
		queryKey: ['fields'],
		queryFn: async () => {
			return await requestAnalyticsFields()
		},
		select(data) {
			return data.message
		},
	})
}

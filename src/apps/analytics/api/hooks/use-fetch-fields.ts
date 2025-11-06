import { useQuery } from '@tanstack/react-query'
import { requestAnalyticsFields } from '../fields'

export function useFetchFields() {
	return useQuery({
		queryKey: ['fields'],
		queryFn: async () => await requestAnalyticsFields(),
		select(data): IResponseAnalyticsFields {
			return data.message as IResponseAnalyticsFields
		},
	})
}

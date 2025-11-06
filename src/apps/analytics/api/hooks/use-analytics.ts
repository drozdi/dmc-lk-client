import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { requestAnalytics } from '../analytics'

export function useAnalytics(params: IRequestAnalytics = {}) {
	const queryClient = useQueryClient()
	const [data, setData] = useState<IResponseAnalytics>({
		id: 0,
		sum_company: 0,
		production: [],
	})
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState<IError>('')

	return {
		data,
		isLoading,
		error,
		request: async (query: IRequestAnalytics = {}) => {
			const _query = {
				...params,
				filterdate: [
					params.filterdate_from || query.filterdate_from,
					params.filterdate_to || query.filterdate_to || '',
				],
				...query,
			}

			setIsLoading(true)
			const res = await queryClient.fetchQuery({
				queryKey: ['analytics', JSON.stringify(_query)],
				queryFn: async (): Promise<IResponseAnalytics> => (await requestAnalytics(_query as IRequestAnalytics)).message,
			})
			setData(res)
			setIsLoading(false)
			return res
		},
	}
}

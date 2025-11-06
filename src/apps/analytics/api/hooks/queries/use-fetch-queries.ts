import { useInfiniteQuery } from '@tanstack/react-query'
import { requestAnalyticsQueriesList } from '../../queries'

export function useFetchQueries(size: number = 100) {
	return useInfiniteQuery({
		queryKey: ['query_users', { size }],
		initialPageParam: 0,
		queryFn: async ({ pageParam }) => {
			const res = await requestAnalyticsQueriesList({ size, number: pageParam })
			if (!res.success) {
				throw new Error(res.message || 'Список запросов: подумать над ошибкой!')
			}
			return res
		},
		getNextPageParam: lastPage => lastPage.nextPage,
		getPreviousPageParam: lastPage => lastPage.prevPage,
		select({ pages }): Array<IAnalyticsElasticQueryItem> {
			return pages[0].data.request
		},
	})
}

import { api } from '../../../shared/api'
import { useQuery } from '../../../shared/hooks'

export async function requestAnalytics(params: IAnalyticsQuery) {
	const arr = []
	for (let key in params) {
		if (Array.isArray(params[key])) {
			params[key].forEach(item => {
				item && arr.push(key + '=' + item)
			})
		} else if (params[key]) {
			arr.push(key + '=' + params[key])
		}
	}
	const res = await api.get(`/analytics/?${arr.join('&')}`)
	return res.data
}

export function useAnalytics() {
	const { request, isLoading, error } = useQuery(requestAnalytics)

	return {
		isLoading,
		error,
		request: async (params: IAnalyticsQuery) => {
			return await request({
				filterdate: [params.filterdate_from, params.filterdate_to || ''],
				step: params.step,
				event: params.event,
			})
		},
	}
}

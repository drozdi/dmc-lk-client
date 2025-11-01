import { api } from '../../../shared/api'

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

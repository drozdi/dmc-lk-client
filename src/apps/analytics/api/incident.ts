import { api } from '../../../shared/api'

export async function requestAnalyticsIncident(
	params: IAnalyticsIncidentQuery
) {
	const arr = []
	for (let key in params) {
		if (Array.isArray(params[key])) {
			params[key].forEach(item => {
				arr.push(key + '=' + item)
			})
		} else if (params[key]) {
			arr.push(key + '=' + params[key])
		}
	}
	const res = await api.get(`/analytics/incident?${arr.join('&')}`)
	return res.data
}

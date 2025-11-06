import { api } from '../../../shared/api'

export async function requestAnalyticsIncident(
	params: IRequestAnalyticsIncident
): Promise<IResponse<IResponseAnalyticsIncident>> {
	const arr = []
	for (let key in params) {
		if (Array.isArray(params[key as keyof IRequestAnalyticsIncident])) {
			;(params[key as keyof IRequestAnalyticsIncident] as string[]).forEach(item => {
				item && arr.push(key + '=' + item)
			})
		} else if (params[key as keyof IRequestAnalyticsIncident]) {
			arr.push(key + '=' + params[key as keyof IRequestAnalyticsIncident])
		}
	}
	const res = await api.get(`/analytics/incident?${arr.join('&')}`)
	return res.data
}

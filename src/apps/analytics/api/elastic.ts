import { api } from '../../../shared/api'

export async function requestAnalyticsElastic(params: IAnalyticsElasticQuery) {
	return await api.post('/analytics/elastic', params)
}

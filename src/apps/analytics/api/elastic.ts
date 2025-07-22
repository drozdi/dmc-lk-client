import { api } from '../../../shared/api'

export async function requestElastic(params: Record<string, any>) {
	return await api.post('/analytics/elastic', params)
}

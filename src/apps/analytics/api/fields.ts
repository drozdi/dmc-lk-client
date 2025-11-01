import { api } from '../../../shared/api'

export async function requestAnalyticsFields() {
	return (await api.get('/analytics/available_fields')).data
}

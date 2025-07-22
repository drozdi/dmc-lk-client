import { api } from '../../../shared/api'

export async function requestFields() {
	return await api.get('/analytics/available_fields')
}

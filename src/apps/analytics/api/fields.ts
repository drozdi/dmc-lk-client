import { api } from '../../../shared/api'

export async function requestAnalyticsFields(
	params: IRequestAnalyticsFields = {}
): Promise<IResponse<IResponseAnalyticsFields>> {
	return (
		await api.get('/analytics/available_fields', {
			params,
		})
	).data
}

import { api } from '../../../shared/api'

export async function requestAnalyticsQueriesList({
	size = 100,
	number = 0,
}: {
	size?: number
	number?: number
} = {}) {
	const res = await api.get('/query_users/', {
		params: {
			size,
			number,
		},
	})
	return res.data
}

export async function requestAnalyticsQueriesGet(id: number) {
	const res = await api.get(`/query_users/query_id/?id_query=${id}`)
	return res.data.data
}

export async function requestAnalyticsQueriesUpdate(id: number, name: string, data: IAnalyticsElasticQuery) {
	const res = await api.patch(`/query_users/?id_record=${id}&name_query=${name}`, data)
	return res.data
}
export async function requestAnalyticsQueriesDelete(id: number) {
	const res = await api.delete(`/query_users/?id_record=${id}`)
	return res.data
}
export async function requestAnalyticsQueriesAdd(name: string, data: IAnalyticsElasticQuery) {
	const res = await api.post(`/query_users/save_query/?name_query=${name}`, data)
	return res.data
}

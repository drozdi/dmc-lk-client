import { api } from '../../../shared/api'

export async function requestLabelsCountReset(params: {
	production_id: number
}) {
	const res = await api.get('/count_label/reset/', { params })
	return res.data
}

export async function requestLabelsCountHistory({
	size = 100,
	number = 0,
}: {
	size?: number
	number?: number
} = {}) {
	const res = await api.get('/count_label/history/', {
		params: { size, number },
	})
	return res.data
}

export async function requestLabelsCount() {
	const res = await api.get('/count_label/')
	return res.data
}

export async function requestLabelsCountAdd(data: {
	label_format: string
	count_label: number
	place_name: string
	production_id: number
}) {
	const res = await api.post('/count_label/', data)
	return res.data
}

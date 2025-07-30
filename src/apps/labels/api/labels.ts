import { api } from '../../../shared/api'

export async function requestLabelsAllFormat() {
	const res = await api.get('/label/all_format')
	return res.data
}
export async function requestLabelsAllPrint() {
	const res = await api.get('/label/all_print_format')
	return res.data
}
export async function requestLabelsList({
	size = 100,
	number = 0,
}: {
	size?: number
	number?: number
}) {
	const res = await api.get(`/label/?size=${size}&number=${number}`)
	return res.data.data
}
export async function requestLabelsJoinFormat(data: {
	production_id?: number | string
	add_label_format?: string
	statistics_print_format?: string
}) {
	const res = await api.post('/label/', data)
	return res.data
}
export async function requestLabelsDetachFormat(id: number | number[]) {
	const res = await api.delete('/label/', {
		data: {
			id_rel_label: [].concat(id),
		},
	})
	return res.data
}
export async function requestLabelsAddFormat({
	format,
	production_id,
}: {
	format: string
	production_id: number
}) {
	const res = await api.post('/label/new_format', {
		add_label_format: format,
		production_id,
	})
	return res.data
}

export async function requestLabelsUpdateJoined(
	id: number,
	data: {
		production_id?: number | string
		add_label_format?: string
		statistics_print_format?: string
	}
) {
	const res = await api.patch(`/label/${id}`, data)
	return res.data
}

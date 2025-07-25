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
export async function requestLabelsJoinFormat({
	format,
	print,
}: {
	format?: string
	print?: string
}) {
	const res = await api.post('/label/', {
		add_label_format: format,
		statistics_print_format: print,
	})
	return res.data
}
export async function requestLabelsDetachFormat(id: number | number[]) {
	const res = await api.delete('/label/', {
		id_rel_label: Array.isArray(id) ? id : [id],
	})
	return res.data
}
export async function requestLabelsAddFormat(format: string) {
	const res = await api.post('/label/new_format', {
		add_label_format: format,
	})
	return res.data
}

export async function requestLabelsUpdateJoined(
	id: number,
	{
		format,
		print,
	}: {
		format?: string
		print?: string
	}
) {
	const res = await api.post(`/label/${id}`, {
		add_label_format: format,
		statistics_print_format: print,
	})
	return res.data
}

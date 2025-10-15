import { api } from '../../../shared/api'

export async function requestLabelsCountReset(production_id: IRequestCountLabelReset) {
	const res = await api.get('/count_label/reset/', { params: { production_id } })
	return res.data
}

export async function requestLabelsCountHistory({
	size = 100,
	number = 0,
	date_applic = [],
}: IRequestCountLabelHistory = {}): Promise<IResponse<IResponseCountLabelHistory>> {
	const arr = ['size=' + size, 'number=' + number]
	if (Array.isArray(date_applic)) {
		date_applic.forEach(item => {
			item && arr.push('date_applic=' + item)
		})
	} else if (date_applic) {
		arr.push(`date_applic=${date_applic}`)
	}
	const res = await api.get(`/count_label/history/?${arr.join('&')}`)
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

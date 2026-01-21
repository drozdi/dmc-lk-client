import { useEffect, useMemo } from 'react'
import { useQuery_ } from '../../../../shared/hooks'
import { requestLabelsCountHistory } from '../../api'

export function useConsumptions(params: IRequestCountLabelHistory = {}) {
	const request = useQuery_(['labels-count-history'], requestLabelsCountHistory, {
		select(data) {
			return data.data.response
		},
	})

	useEffect(() => {
		request.fetch({ ...params })
	}, [])

	return useMemo(() => {
		const res = {}
		for (let prod in request.data) {
			res[prod] = res[prod] || {}
			for (let detail of request.data[prod]) {
				res[prod][detail.format_template] = res[prod][detail.format_template] || 0
				res[prod][detail.format_template] += detail.consumption_m || 0
			}
		}
		return res
	}, [request.data])
}

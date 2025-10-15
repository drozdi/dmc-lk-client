import { useCallback, useMemo, useState } from 'react'
import { useQuery } from '../../../../shared/hooks'
import { requestLabelsCountHistory } from '../../api'

export function useConsumption(params: IRequestCountLabelHistory = {}) {
	const request = useQuery(requestLabelsCountHistory)
	const [list, setList] = useState<IResponseCountLabelHistory>({})
	const load = useCallback((query: IRequestCountLabelHistory = {}) => {
		request.request({ ...params, ...query }).then(res => {
			setList(res.data.response)
		})
	}, [])
	const res = useMemo(() => {
		const res = {}
		for (let prod in list) {
			res[prod] = res[prod] || {}
			for (let detail of list[prod]) {
				res[prod][detail.format_template] = res[prod][detail.format_template] || 0
				res[prod][detail.format_template] += detail.consumption_m || 0
			}
		}
		return res
	}, [list])

	return { ...request, res, load }
}

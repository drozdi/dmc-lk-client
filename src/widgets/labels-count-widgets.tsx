import dayjs from 'dayjs'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useAnalytics } from '../apps/analytics/api'
import { requestLabelsCount } from '../apps/labels/api'
import { useLabelFormat } from '../apps/labels/entites/hooks/use-label-format'
import { useProduction } from '../components/stores/hooks/use-production'
import { useQuery } from '../shared/hooks'

const dNow = dayjs('2025-05-02')

export const LabelsCountWidget = observer(() => {
	const reqAnalytics = useAnalytics({
		filterdate: [dNow.day(dNow.day() - 7).format('YYYY-MM-DD'), dNow.format('YYYY-MM-DD')],
		step: 'd',
		event: 'p',
	})
	useLabelFormat()

	const { productionNameById } = useProduction()
	const { isLoading, error, request } = useQuery(requestLabelsCount)
	async function fetch() {
		await reqAnalytics.request({})
		const res = await request()
		setData(res.data)
	}
	const [data, setData] = useState({
		distributed: [],
		not_distributed: [],
	})
	useEffect(() => {
		fetch()
	}, [])

	//console.log(data)
	return <></>
})

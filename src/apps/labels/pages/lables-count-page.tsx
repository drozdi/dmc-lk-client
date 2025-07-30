import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from '../../../shared/hooks'
import { DmcItem, DmcList, DmcLoading } from '../../../shared/ui'
import { requestLabelsCount } from '../api'
import { ReportGroup } from './components/report/group'
import { ReportItem } from './components/report/item'

export function LabelsCountPage() {
	const { isLoading, error, request } = useQuery(requestLabelsCount)
	const [dangerLimits, setDangerLimits] = useState(0)
	const [warningLimits, setWarningLimits] = useState(-50)

	const [data, setData] = useState({
		distributed: [],
		not_distributed: [],
	})
	const filterProdaction = useCallback(id => {
		return !!id
	}, [])

	const { distributed, notDistributed } = useMemo(() => {
		const res = { distributed: {}, notDistributed: {} }
		data.distributed
			.filter(item => filterProdaction(item.production_id))
			.forEach(item => {
				res.distributed[item.add_label_format] = {
					add_label_format: item.add_label_format,
					production_id: item.production_id,
					sum: (res.distributed[item.add_label_format]?.sum || 0) + item.sum,
					items: [
						...(res.distributed[item.add_label_format]?.items || []),
						item,
					],
				}
			})
		data.not_distributed
			.filter(item => filterProdaction(item.production_id))
			.forEach(item => {
				res.notDistributed[item.add_label_format] = {
					add_label_format: item.add_label_format,
					production_id: item.production_id,
					sum: (res.notDistributed[item.add_label_format]?.sum || 0) + item.sum,
					items: [
						...(res.notDistributed[item.add_label_format]?.items || []),
						item,
					],
				}
			})
		return {
			distributed: Object.values(res.distributed),
			notDistributed: Object.values(res.notDistributed),
		}
	}, [data, filterProdaction])

	console.log(distributed)
	console.log(notDistributed)

	async function fetch() {
		const res = await request()
		setData(res.data)
	}

	useEffect(() => {
		fetch()
	}, [])

	return (
		<div>
			<DmcLoading active={isLoading} keepMounted>
				<DmcList separator>
					{distributed.map(item =>
						item.items.length > 1 ? (
							<ReportGroup
								key={item.add_label_format}
								item={item}
								dangerLimits={dangerLimits}
								warningLimits={warningLimits}
							/>
						) : (
							<ReportItem
								key={item.add_label_format}
								item={item}
								dangerLimits={dangerLimits}
								warningLimits={warningLimits}
							/>
						)
					)}
					<DmcItem></DmcItem>
					{notDistributed.map(item =>
						item.items.length > 1 ? (
							<ReportGroup
								key={item.add_label_format}
								item={item}
								dangerLimits={dangerLimits}
								warningLimits={warningLimits}
							/>
						) : (
							<ReportItem
								key={item.add_label_format}
								item={item}
								dangerLimits={dangerLimits}
								warningLimits={warningLimits}
							/>
						)
					)}
				</DmcList>
			</DmcLoading>
		</div>
	)
}

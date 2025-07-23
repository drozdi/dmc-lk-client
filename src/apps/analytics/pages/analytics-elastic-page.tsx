import { useEffect, useState } from 'react'
import { Loading } from '../../../shared/ui'
import { TableElastic } from '../features/elastic/table'
import { elasticStore } from '../stores/elastic-store'
export function AnalyticsElasticPage() {
	const [isLoading, setIsLoading] = useState(true)
	const clear = async () => {
		await elasticStore.clear()
		setIsLoading(false)
	}
	useEffect(() => {
		clear()
	}, [])
	return (
		<Loading active={isLoading}>
			<TableElastic />
		</Loading>
	)
}

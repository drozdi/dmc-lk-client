import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { DmcLoading } from '../../../shared/ui'
import { TableElastic } from '../features/elastic/table'
import { elasticStore } from '../stores/elastic-store'
export const AnalyticsElasticPage = observer(() => {
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		elasticStore.clear()
		setIsLoading(false)
	}, [])
	return (
		<DmcLoading active={isLoading}>
			<TableElastic />
		</DmcLoading>
	)
})

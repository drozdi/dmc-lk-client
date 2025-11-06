import { Paper } from '@mantine/core'
import { Template } from '@t'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { Loading } from '../../../shared/ui'
import { TableElastic } from '../features/elastic/table'
import { elasticStore } from '../stores/elastic-store'

export const AnalyticsElasticPage = observer(() => {
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		elasticStore.clear()
		setIsLoading(false)
	}, [])
	return (
		<Paper>
			<Template.Title>Новый шаблон</Template.Title>
			<Loading active={isLoading}>
				<TableElastic />
			</Loading>
		</Paper>
	)
})

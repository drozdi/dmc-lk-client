import { SimpleGrid } from '@mantine/core'
import dayjs from 'dayjs'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { AnalyticAllWidget } from '../apps/analytics/widgets/analytic-all-widget'
import { LabelsCountWidget } from '../widgets/labels-count-widgets'

const dNow = dayjs('2025-05-02')

export const MainPage = observer(() => {
	const [query, setQuery] = useState<Omit<IAnalyticsQuery, 'step' | 'event'>>({
		filterdate_from: dNow.day(dNow.day() - 7).format('YYYY-MM-DD'),
		filterdate_to: dNow.format('YYYY-MM-DD'),
	})
	return (
		<SimpleGrid cols={2} spacing='xs' verticalSpacing='xs'>
			<LabelsCountWidget {...query} />
			<AnalyticAllWidget {...query} step='d' />
		</SimpleGrid>
	)
})

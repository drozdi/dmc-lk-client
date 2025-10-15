import { SimpleGrid } from '@mantine/core'
import dayjs from 'dayjs'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { AnalyticPieWidget } from '../apps/analytics/widgets/analytic-pie-widget'
import { LabelsCountWidget } from '../apps/labels/widgets/labels-count-widget'
import { LabelsCountWidget as MainCountWidget } from '../widgets/labels-count-widget'

const dNow = dayjs('2025-05-02')

export const MainPage = observer(() => {
	const [query] = useState<Omit<IAnalyticsQuery, 'event'>>({
		filterdate_from: dNow.day(dNow.day() - 7).format('YYYY-MM-DD'),
		filterdate_to: dNow.format('YYYY-MM-DD'),
		step: 'd',
	})
	return (
		<SimpleGrid cols={2}>
			<MainCountWidget {...query} />
			<AnalyticPieWidget {...query} />
			<LabelsCountWidget />
		</SimpleGrid>
	)
})

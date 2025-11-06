import { Paper } from '@mantine/core'
import { Template } from '../../../layout'
import { IncidentTable } from '../features/incident/table'

export function AnalyticsIncidentFilterPage() {
	return (
		<Paper>
			<Template.Title>Поиск по инцидентам</Template.Title>
			<IncidentTable />
		</Paper>
	)
}

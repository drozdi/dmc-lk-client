import { Paper } from '@mantine/core'
import { Template } from '@t'
import { IncidentTable } from '../features/incident/table'

export function AnalyticsIncidentFilterPage() {
	return (
		<Paper>
			<Template.Title slot='title'>Поиск по инцидентам</Template.Title>
			<IncidentTable />
		</Paper>
	)
}

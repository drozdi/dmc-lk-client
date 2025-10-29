import { Paper } from '@mantine/core'
import { TemplateTitle } from '@t'
import { IncidentTable } from '../features/incident/table'

export function AnalyticsIncidentFilterPage() {
	return (
		<Paper>
			<TemplateTitle slot='title'>Поиск по инцидентам</TemplateTitle>
			<IncidentTable />
		</Paper>
	)
}

import { IncidentTable } from "@/features/analytics/incident/table";
import { Paper } from "@mantine/core";
import { Template } from "@t";

export function AnalyticsIncidentFilterPage() {
	return (
		<Paper>
			<Template.Title>Поиск по инцидентам</Template.Title>
			<IncidentTable />
		</Paper>
	);
}

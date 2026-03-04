import { IncidentTable } from "@/features/analytics/incident/table";
import { Template } from "@/layout";
import { Paper } from "@mantine/core";

export function AnalyticsIncidentFilterPage() {
	return (
		<Paper>
			<Template.Title>Поиск по инцидентам</Template.Title>
			<IncidentTable />
		</Paper>
	);
}

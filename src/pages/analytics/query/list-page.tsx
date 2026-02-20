import { AnalyticsQueryList } from "@/features/analytics/query/list";
import { Paper } from "@mantine/core";
import { Template } from "@t";

export function AnalyticsQueryListPage() {
	return (
		<Paper>
			<Template.Title fz="h2" ta="center">
				Список запросов
			</Template.Title>
			<AnalyticsQueryList />
		</Paper>
	);
}

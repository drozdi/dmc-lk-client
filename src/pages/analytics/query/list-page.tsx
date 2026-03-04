import { AnalyticsQueryList } from "@/features/analytics/query/list";
import { Template } from "@/layout";
import { Paper } from "@mantine/core";

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

import { ANALYTICS_EMPTY_HINT, ANALYTICS_EMPTY_TITLE } from "@/entites/analytics/constants";
import { EmptyState } from "@/shared/ui";
import { QueryShow } from "./query-show";

export function AnalyticsEmpty({
	query,
	title = ANALYTICS_EMPTY_TITLE,
	hint = ANALYTICS_EMPTY_HINT,
}: {
	query: Partial<IRequestAnalytics> | Partial<IRequestAnalyticsIncident>;
	title?: string;
	hint?: string;
}) {
	return (
		<EmptyState
			title={title}
			description={
				<>
					{hint}
					<br />
					За <QueryShow {...query} />
				</>
			}
		/>
	);
}

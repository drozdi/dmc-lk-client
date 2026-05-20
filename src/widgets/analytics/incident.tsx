import { QueryShow, useStoreIncident } from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { AnalyticIncident, type AnalyticIncidentProps } from '@/features/analytics/widgets';
import {
	Widget,
	type WidgetProps
} from "@/shared/ui";
import { useEffect, useState } from "react";


export interface WidgetAnalyticsIncidentProps extends WidgetProps, AnalyticIncidentProps {}

export const WidgetAnalyticIncident = ({
	filterdate,
	...props
}: WidgetAnalyticsIncidentProps) => {
	//return "";
	const isLoading = useStoreIncident(state => state.isLoading);
	const production_id = Number(useStoreUserProfile((state) => state.production_id) || 0);
	const [query, setQuery] = useState<Required<IRequestAnalyticsIncident>>({
		filterdate: filterdate || [null, null],
		data: [],
		fields_name: [],
	});

	useEffect(() => {
		setQuery((v) => ({ ...v, filterdate }));
	}, [filterdate]);

	return (
		<Widget
			loading={isLoading}
			{...props}
			title='Инциденты'
			subTitle={<>За <QueryShow {...query} /></>}
		>
			<AnalyticIncident filterdate={query.filterdate} />
		</Widget>
	);
};

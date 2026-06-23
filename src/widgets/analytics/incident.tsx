import { QueryShow } from "@/entites/analytics";
import { exportIncidentChart } from "@/features/analytics/incident/utils/export-excel";
import { buildIncidentReportUrl } from "@/features/analytics/incident/utils/incident-navigation";
import {
	AnalyticIncident,
	type AnalyticIncidentProps,
	type AnalyticIncidentSlice,
} from '@/features/analytics/widgets';
import { notification } from "@/shared/notification/notification";
import {
	Widget,
	type WidgetProps
} from "@/shared/ui";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";


export interface WidgetAnalyticsIncidentProps extends WidgetProps, AnalyticIncidentProps {}

export const WidgetAnalyticIncident = ({
	filterdate,
	...props
}: WidgetAnalyticsIncidentProps) => {
	const navigate = useNavigate();
	const chartData = useRef<AnalyticIncidentSlice[]>([]);

	const handleSliceClick = (slice: AnalyticIncidentSlice) => {
		navigate(
			buildIncidentReportUrl({
				filterdate: filterdate || [null, null],
				data: slice.name,
				tab: "generate",
			}),
		);
	};

	return (
		<Widget
			{...props}
			loading={false}
			title='Инциденты'
			subTitle={
				<>
					За <QueryShow filterdate={filterdate || [null, null]} />
				</>
			}
			onDownload={() => {
				if (!chartData.current.length) {
					notification.alert("Нет данных для скачивания");
					return;
				}

				exportIncidentChart(chartData.current, filterdate || [null, null]);
			}}
		>
			<AnalyticIncident
				filterdate={filterdate}
				onSliceClick={handleSliceClick}
				onLoaded={(data) => {
					chartData.current = data;
				}}
			/>
		</Widget>
	);
};

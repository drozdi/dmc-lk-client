import { QueryShow } from "@/entites/analytics";
import {
	AnalyticEventsDefect,
	type AnalyticEventsDefectProps,
} from "@/features/analytics/widgets";
import { Widget, type WidgetProps } from "@/shared/ui";

export interface WidgetAnalyticEventsDefectProps
	extends WidgetProps, AnalyticEventsDefectProps {}

export const WidgetAnalyticEventsDefect = ({
	filterdate,
	step = "d",
	event = "d",
	...props
}: WidgetAnalyticEventsDefectProps) => {
	return (
		<Widget
			{...props}
			title='Отчет по дефектам'
			subTitle={
				<>
					За <QueryShow filterdate={filterdate} step={step} event={event} />
				</>
			}
		>
			<AnalyticEventsDefect
				filterdate={filterdate}
				step={step}
				event={event}
			/>
		</Widget>
	);
};

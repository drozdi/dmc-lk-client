import { QueryShow } from "@/entites/analytics";
import {
	AnalyticType,
	type AnalyticTypeProps,
} from "@/features/analytics/widgets";
import { Widget, type WidgetProps } from "@/shared/ui";
import { memo } from "react";

export interface WidgetAnalyticTypeProps
	extends WidgetProps, AnalyticTypeProps {}

export const WidgetAnalyticType = memo(
	({
		filterdate,
		step = "d",
		event = "p",
		...props
	}: WidgetAnalyticTypeProps) => {
		return (
			<Widget
				{...props}
				title='Напечатано этикеток'
				subTitle={
					<>
						За <QueryShow filterdate={filterdate} step={step} event={event} />
					</>
				}
			>
				<AnalyticType filterdate={filterdate} step={step} event={event} />
			</Widget>
		);
	},
);

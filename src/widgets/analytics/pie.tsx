import { QueryShow } from "@/entites/analytics";
import {
	AnalyticPie,
	type AnalyticPieProps,
} from "@/features/analytics/widgets";
import { Widget, type WidgetProps } from "@/shared/ui";
import { memo, useEffect, useState } from "react";

export interface WidgetAnalyticPieProps extends WidgetProps, AnalyticPieProps {}

export const WidgetAnalyticPie = memo(
	({
		filterdate,
		events = ["v", "d", "i"],
		percent,
		...props
	}: WidgetAnalyticPieProps) => {
		const [query, setQuery] = useState<Partial<IRequestAnalytics>>({
			filterdate,
			step: "mon",
		});

		useEffect(() => {
			setQuery((v) => ({ ...v, filterdate }));
		}, [filterdate]);

		return (
			<Widget
				{...props}
				title='Сводная по событиям'
				subTitle={
					<>
						За <QueryShow {...(query as IRequestAnalytics) } />
					</>
				}
			>
				<AnalyticPie {...query} events={events} percent={percent} />
			</Widget>
		);
	},
);

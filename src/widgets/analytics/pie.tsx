import { useQueryAnalytics } from "@/entites/analytics";
import {
	AnalyticPie,
	type AnalyticPieProps,
} from "@/features/analytics/widgets";
import { Widget, type WidgetProps } from "@/shared/ui";
import { memo, useEffect, useState } from "react";
import { Filterdate } from "../labels/ui/filterdate";

export interface WidgetAnalyticPieProps extends WidgetProps, AnalyticPieProps {}

export const WidgetAnalyticPie = memo(
	({
		filterdate,
		events = ["v", "d", "i"],
		...props
	}: WidgetAnalyticPieProps) => {
		const { isLoading, error } = useQueryAnalytics();

		const [query, setQuery] = useState<Partial<IRequestAnalytics>>({
			filterdate,
			step: "mon",
		});

		useEffect(() => {
			setQuery((v) => ({ ...v, filterdate }));
		}, [filterdate]);

		return (
			<Widget
				error={error}
				loading={isLoading}
				{...props}
				title={
					<>
						Соотношение за{" "}
						<Filterdate
							filterdate={query.filterdate}
							editable={!filterdate?.[0]}
							onChange={(filterdate) => {
								setQuery({
									...query,
									filterdate,
								});
							}}
						/>
					</>
				}
			>
				<AnalyticPie {...query} events={events} />
			</Widget>
		);
	},
);

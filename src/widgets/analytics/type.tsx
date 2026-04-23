import { Filterdate, useQueryAnalytics } from "@/entites/analytics";
import {
	AnalyticType,
	type AnalyticTypeProps,
} from "@/features/analytics/widgets";
import { Widget, type WidgetProps } from "@/shared/ui";
import { memo, useEffect, useState } from "react";

export interface WidgetAnalyticTypeProps
	extends WidgetProps, AnalyticTypeProps {}

export const WidgetAnalyticType = memo(
	({
		filterdate,
		step = "d",
		event = "p",
		...props
	}: WidgetAnalyticTypeProps) => {
		const [query, setQuery] = useState<IRequestAnalytics>({
			filterdate,
			step,
			event,
		});
		const { isLoading } = useQueryAnalytics(query);

		useEffect(() => {
			setQuery((v) => ({ ...v, filterdate, step, event }));
		}, [filterdate, step, event]);

		return (
			<Widget
				{...props}
				loading={isLoading}
				title={
					<>
						Напечатано за{" "}
						<Filterdate
							value={query.filterdate}
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
				<AnalyticType {...query} />
			</Widget>
		);
	},
);

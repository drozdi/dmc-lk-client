import { Filterdate, useQueryAnalytics } from "@/entites/analytics";
import {
	AnalyticEvents,
	type AnalyticEventsProps,
} from "@/features/analytics/widgets";
import { Widget, type WidgetProps } from "@/shared/ui";
import { useEffect, useState } from "react";

export interface WidgetAnalyticEventsProps
	extends WidgetProps, AnalyticEventsProps {}

export const WidgetAnalyticEvents = ({
	filterdate,
	step = "d",
	events = ["v", "i", "d", "p"],
	type = "line",
	stop = "m",
	onClick,
	percent = ["d"],
	...props
}: WidgetAnalyticEventsProps) => {
	const [query, setQuery] = useState<Partial<IRequestAnalytics>>({
		filterdate,
		step,
	});
	const { isLoading, error } = useQueryAnalytics(query);

	useEffect(() => {
		setQuery({ filterdate, step });
	}, [filterdate, step]);

	return (
		<Widget
			loading={isLoading}
			error={error}
			{...props}
			title={
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
			}
		>
			<AnalyticEvents
				{...query}
				events={events}
				type={type}
				stop={stop}
				percent={percent}
				onClick={onClick}
			/>
		</Widget>
	);
};

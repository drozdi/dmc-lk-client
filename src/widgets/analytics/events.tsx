import { useQueryAnalytics } from "@/entites/analytics";
import {
	AnalyticEvents,
	type AnalyticEventsProps,
} from "@/features/analytics/widgets";
import { Widget, type WidgetProps } from "@/shared/ui";
import { useEffect, useState } from "react";
import { Filterdate } from "../labels/ui/filterdate";

export interface WidgetAnalyticEventsProps
	extends WidgetProps, AnalyticEventsProps {}

export const WidgetAnalyticEvents = ({
	filterdate,
	step = "d",
	events = ["v", "i", "d", "p"],
	type = "line",
	stop = "m",
	onClick,
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
					filterdate={query.filterdate}
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
				onClick={onClick}
			/>
		</Widget>
	);
};

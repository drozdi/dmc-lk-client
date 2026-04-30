import { Filterdate, useAnalytics } from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import {
	AnalyticEventsDefect,
	type AnalyticEventsDefectProps,
} from "@/features/analytics/widgets";
import { Widget, type WidgetProps } from "@/shared/ui";
import { useEffect, useState } from "react";

export interface WidgetAnalyticEventsDefectProps
	extends WidgetProps, AnalyticEventsDefectProps {}

export const WidgetAnalyticEventsDefect = ({
	filterdate,
	step = "d",
	event = "d",
	...props
}: WidgetAnalyticEventsDefectProps) => {
	const production_id = Number(
		useStoreUserProfile((state) => state.production_id) || 0,
	);
	const [query, setQuery] = useState<Partial<IRequestAnalytics>>({
		filterdate,
		step,
		event,
		production_id,
	});

	const { isLoading, error, fetch } = useAnalytics(query);

	useEffect(() => {
		fetch(query);
	}, [query]);

	useEffect(() => {
		setQuery({ filterdate, step, event, production_id });
	}, [filterdate, step, event, production_id]);

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
			<AnalyticEventsDefect {...query} />
		</Widget>
	);
};

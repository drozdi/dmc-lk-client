import { QueryShow, useAnalytics } from "@/entites/analytics";
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
	const productions = useStoreUserProfile((state) => state.productions);
	const [query, setQuery] = useState<IRequestAnalytics>({
		filterdate,
		step,
		event,
		production_id: productions,
	});

	const { isLoading, error, fetch } = useAnalytics(query);

	useEffect(() => {
		fetch(query);
	}, [query]);

	useEffect(() => {
		setQuery({ filterdate, step, event, production_id: productions });
	}, [filterdate, step, event, productions]);

	return (
		<Widget
			loading={isLoading}
			error={error}
			{...props}
			title='Отчет по дефектам'
			subTitle={<>
				За <QueryShow {...query} />
			</>}
		>
			<AnalyticEventsDefect {...query} />
		</Widget>
	);
};

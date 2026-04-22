import { useQueryAnalytics } from "@/entites/analytics";
import {
	LabelsEvents,
	type LabelsEventsProps,
} from "@/features/labels/widgets";
import { Widget, type WidgetProps } from "@/shared/ui";
import { useEffect, useState } from "react";
import { Filterdate } from "./ui/filterdate";

export interface WidgetLabelsEventsProps
	extends WidgetProps, LabelsEventsProps {}

export const WidgetLabelsEvents = ({
	filterdate,
	step = "d",
	events = ["v", "i", "d", "p"],
	type = "line",
	...props
}: WidgetLabelsEventsProps) => {
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
			<LabelsEvents {...query} events={events} type={type} />
		</Widget>
	);
};

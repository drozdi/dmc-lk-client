import { useQueryAnalytics } from "@/entites/analytics";
import { LabelsType, type LabelsTypeProps } from "@/features/labels/widgets";
import { Widget, type WidgetProps } from "@/shared/ui";
import { memo, useEffect, useState } from "react";
import { Filterdate } from "./ui/filterdate";

export interface WidgetLabelsTypeProps extends WidgetProps, LabelsTypeProps {}

export const WidgetLabelsType = memo(
	({
		filterdate,
		step = "d",
		event = "p",
		...props
	}: WidgetLabelsTypeProps) => {
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
				<LabelsType {...query} />
			</Widget>
		);
	},
);

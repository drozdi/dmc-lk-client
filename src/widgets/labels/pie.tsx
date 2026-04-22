import { useQueryAnalytics } from "@/entites/analytics";
import { LabelsPie, type LabelsPieProps } from "@/features/labels/widgets";
import { Widget, type WidgetProps } from "@/shared/ui";
import { memo, useEffect, useState } from "react";
import { Filterdate } from "./ui/filterdate";

export interface WidgetLabelsPieProps extends WidgetProps, LabelsPieProps {}

export const WidgetLabelsPie = memo(
	({ filterdate, ...props }: WidgetLabelsPieProps) => {
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
				<LabelsPie {...query} />
			</Widget>
		);
	},
);

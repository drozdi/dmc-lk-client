import { QueryShow, useQueryAnalytics } from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import {
	AnalyticLabels,
	type AnalyticLabelsProps,
} from "@/features/analytics/widgets";
import { Widget, type WidgetProps } from "@/shared/ui";
import { memo, useEffect, useMemo, useState } from "react";

export interface WidgetAnalyticLabelsProps
	extends Omit<WidgetProps, "children" | "title">, AnalyticLabelsProps {
	title?: WidgetProps["title"];
}

export const WidgetAnalyticLabels = memo(
	({
		title,
		filterdate,
		step = "d",
		event = "p",
		type = "default",
		...props
	}: WidgetAnalyticLabelsProps) => {
		const production_id = Number(
			useStoreUserProfile((state) => state.production_id) || 0,
		);
		const [query, setQuery] = useState<IRequestAnalytics>({
			filterdate,
			step,
			event,
			production_id,
		});
		const { isLoading, fetch, error } = useQueryAnalytics(query);

		useEffect(() => {
			setQuery((v) => ({
				...v,
				filterdate,
				step,
				production_id,
			}));
		}, [filterdate, step, production_id]);

		useEffect(() => {
			fetch();
		}, [query]);

		const computedTitle = useMemo(() => {
			if (title) {
				return title;
			}
			if (event === "d") {
				return "Дефекты при печати";
			} else if (event === "i") {
				return "Инциденты при печати";
			} else if (event === "v") {
				return "Проверенно этикеток";
			}
			return "Напечатано этикеток";
		}, [title, event]);

		return (
			<Widget
				error={error}
				loading={isLoading}
				{...props}
				title={computedTitle}
				subTitle={<>За <QueryShow {...query} /></>}
			>
				<AnalyticLabels
					filterdate={filterdate}
					step={step}
					event={event}
					type={type}
				/>
			</Widget>
		);
	},
);

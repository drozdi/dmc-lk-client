import { useQueryAnalytics } from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import {
	AnalyticLabels,
	type AnalyticLabelsProps,
} from "@/features/analytics/widgets";
import { $setting } from "@/shared";
import { Widget, type WidgetProps } from "@/shared/ui";
import dayjs from "dayjs";
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
		const { production_id } = useStoreUserProfile();
		const [query, setQuery] = useState<IRequestAnalytics>({
			filterdate,
			step,
			event,
		});
		const { isLoading, fetch, error } = useQueryAnalytics(query);

		useEffect(() => {
			setQuery((v) => ({
				...v,
				filterdate,
				step,
			}));
		}, [filterdate, step]);

		useEffect(() => {
			fetch();
		}, [query]);

		const computedTitle = useMemo(() => {
			if (title) {
				return title;
			}
			if (event === "d") {
				return "Дефект";
			} else if (event === "i") {
				return "Инциденты";
			} else if (event === "v") {
				return "Проверенно";
			}
			return "Напечатано";
		}, [title, event]);

		return (
			<Widget
				error={error}
				loading={isLoading}
				{...props}
				title={computedTitle}
				subTitle={`${dayjs(query.filterdate[0]).format($setting.get("formatDate"))} - ${dayjs(query.filterdate[1]).format($setting.get("formatDate"))}`}
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

import { QueryShow, useAnalytics } from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import {
	AnalyticItogSet,
	type AnalyticItogSetProps,
} from "@/features/analytics/widgets/itog-set";
import { Widget, type WidgetProps } from "@/shared/ui";
import { memo, useEffect, useMemo } from "react";

export interface WidgetAnalyticItogSetProps
	extends Omit<WidgetProps, "title" | "children">, AnalyticItogSetProps {
	title?: WidgetProps["title"];
}

export const WidgetAnalyticItogSet = memo(
	({
		filterdate,
		event = "p",
		type = "sum",
		title,
		...props
	}: WidgetAnalyticItogSetProps) => {
		const production_id = Number(
			useStoreUserProfile((state) => state.production_id) || 0,
		);
		const { isLoading, error, fetch, query } = useAnalytics({
			filterdate,
			event,
			production_id,
		});

		const computedTitle = useMemo(() => {
			if (title) {
				return title;
			}
			if (event === "d") {
				return "Дефектов при печати";
			} else if (event === "i") {
				return "Инциденты при печати";
			} else if (event === "v") {
				return "Проверенно";
			}
			return type === "sum" ? "Расход этикеток" : type === "min" ? "Минимальный расход этикеток" : type === "max" ? "Максимальный расход этикеток" : 'Средний расход этикеток';
		}, [title, type, event]);

		useEffect(() => {
			fetch({
				filterdate,
				event,
			});
		}, [filterdate, event]);

		return (
			<Widget
				error={error}
				loading={isLoading}
				{...props}
				expanded={false}
				title={computedTitle}
				subTitle={<>За <QueryShow {...query} /></>}
			>
				<AnalyticItogSet {...query} type={type} />
			</Widget>
		);
	},
);

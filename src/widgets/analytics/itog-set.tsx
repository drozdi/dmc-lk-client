import { useAnalytics } from "@/entites/analytics";
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
		const { isLoading, error, fetch, query } = useAnalytics({
			filterdate,
			event,
		});

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
			return type === "sum" ? "Итого по сериям" : "Cумма всех серий";
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
				subTitle={
					type === "sum"
						? "Сумма за период"
						: type === "avg"
							? "Среднее значение"
							: type === "min"
								? "Минимальное значение"
								: "Максимальное значение"
				}
			>
				<AnalyticItogSet {...query} type={type} />
			</Widget>
		);
	},
);

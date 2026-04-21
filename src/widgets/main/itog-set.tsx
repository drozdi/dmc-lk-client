import { MainItogSet, type MainItogSetProps } from "@/features/main/itog-set";
import { Widget, type WidgetProps } from "@/shared/ui";
import { memo, useEffect, useMemo } from "react";
import { useAnalytics } from "./hooks/use-analytics";

export interface WidgetMainItogSetProps
	extends Omit<WidgetProps, "title" | "children">, MainItogSetProps {
	title?: WidgetProps["title"];
}

export const WidgetMainItogSet = memo(
	({
		title,
		type = "sum",
		event = "p",
		filterdate,
		...props
	}: WidgetMainItogSetProps) => {
		const { isLoading, error, fetch } = useAnalytics({
			filterdate,
			event,
			step: "d",
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
				<MainItogSet filterdate={filterdate} type={type} event={event} />
			</Widget>
		);
	},
);

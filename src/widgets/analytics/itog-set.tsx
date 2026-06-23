import { QueryShow } from "@/entites/analytics";
import {
	AnalyticItogSet,
	type AnalyticItogSetProps,
} from "@/features/analytics/widgets/itog-set";
import { Widget, type WidgetProps } from "@/shared/ui";
import { memo, useMemo } from "react";

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
		const computedTitle = useMemo(() => {
			if (title) {
				return title;
			}
			if (event === "d") {
				return "Дефектов при печати";
			} else if (event === "i") {
				return "Инциденты при печати";
			} else if (event === "v") {
				return "Проверено";
			}
			return type === "sum" ? "Расход этикеток" : type === "min" ? "Минимальный расход этикеток" : type === "max" ? "Максимальный расход этикеток" : 'Средний расход этикеток';
		}, [title, type, event]);

		return (
			<Widget
				{...props}
				expanded={false}
				title={computedTitle}
				subTitle={
					<>
						За <QueryShow filterdate={filterdate} event={event} />
					</>
				}
			>
				<AnalyticItogSet filterdate={filterdate} event={event} type={type} />
			</Widget>
		);
	},
);

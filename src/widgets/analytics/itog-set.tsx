import { QueryShow, useAnalytics } from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import {
	AnalyticItogSet,
	type AnalyticItogSetProps,
} from "@/features/analytics/widgets/itog-set";
import { Widget, type WidgetProps } from "@/shared/ui";
import { StatSkeleton } from "@/shared/ui/skeleton";
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
		const productions = useStoreUserProfile((state) => state.productions)

		const { isLoading, error, fetch, query } = useAnalytics({
			filterdate,
			event,
			production_id: productions,
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
				return "Проверено";
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
				loadingSkeleton={<StatSkeleton />}
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

import {
	MainItogAnalytics,
	type MainItogAnalyticsProps,
} from "@/features/main";
import { $setting } from "@/shared";
import { Widget, type WidgetProps } from "@/shared/ui";
import dayjs from "dayjs";
import { memo, useEffect } from "react";
import { TbReload } from "react-icons/tb";
import { useAnalytics } from "./hooks/use-analytics";

const stepLabel = {
	s: "секундам",
	m: "минутам",
	h: "часам",
	d: "дням",
	w: "неделям",
	mon: "месяцам",
	y: "годам",
};

export interface WidgetMainItogAnalyticsProps
	extends Omit<WidgetProps, "children">, MainItogAnalyticsProps {}

export const WidgetMainItogAnalytics = memo(
	({
		filterdate,
		event = "p",
		stop = "m",
		onChange,
		...props
	}: WidgetMainItogAnalyticsProps) => {
		const { isLoading, fetch, error, query, reset } = useAnalytics(
			{
				filterdate,
				event,
			},
			onChange,
		);

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
				title={`Работа за ${dayjs(query.filterdate[0]).format($setting.get("formatDate"))}-${dayjs(query.filterdate[1]).format($setting.get("formatDate"))} по ${stepLabel[query.step]}`}
				menu={[
					{
						children: "Сбросить",
						onClick: reset,
						leftSection: <TbReload />,
					},
				]}
			>
				<MainItogAnalytics
					filterdate={filterdate}
					event={event}
					stop={stop}
					onChange={onChange}
				/>
			</Widget>
		);
	},
);

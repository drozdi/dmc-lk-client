import { QueryShow, useQueryAnalytics } from "@/entites/analytics";
import { useWidgetParams } from "@/entites/dashboard";
import {
	AnalyticEvents,
	type AnalyticEventsProps,
} from "@/features/analytics/widgets";
import { Widget, type WidgetProps } from "@/shared/ui";
import { useEffect, useMemo, useState } from "react";

export interface WidgetAnalyticEventsProps
	extends WidgetProps, AnalyticEventsProps {
		allowChangeType?: boolean
	}

export const WidgetAnalyticEvents = ({
	filterdate,
	step = "d",
	events = ["v", "i", "d", "p"],
	type: typeProp = "line",
	stop = "m",
	onClick,
	percent = ["d"],
	allowChangeType,
	...props
}: WidgetAnalyticEventsProps) => {
	const [query, setQuery] = useState<Partial<IRequestAnalytics>>({
		filterdate,
		step,
	});
	const { isLoading, error } = useQueryAnalytics(query);
	const [type, setType] = useState(typeProp);
  const [_, update] = useWidgetParams()

	const memu = useMemo<any[]>(() => {
		if (!allowChangeType) {
			return []
		}
		return Object.entries({
			line: 'Линии',
			bar: 'Столбцы',
			stack: 'Столбцы (Совмещеные)',
			table: 'Таблица',
			analytic: 'Аналитика',
		}).map(([value, label]) => ({
			children: label,
			color: type === value? "primary": '',
			onClick: () => {
				setType(value)
				update?.('type', value)
			},
		}));
	}, [allowChangeType, type])

	useEffect(() => {
		setQuery({ filterdate, step });
	}, [filterdate, step]);


	return (
		<Widget
			loading={isLoading}
			error={error}
			{...props}
			title='Сводный расход по событиям'
			subTitle={<>За <QueryShow {...query} /></>
			}
			menu={memu}
		>
			<AnalyticEvents
				{...query}
				events={events}
				type={type}
				stop={stop}
				percent={percent}
				onClick={onClick}
			/>
		</Widget>
	);
};

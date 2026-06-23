import { QueryShow } from "@/entites/analytics";
import { useWidgetParams } from "@/entites/dashboard";
import {
	AnalyticEvents,
	type AnalyticEventsProps,
} from "@/features/analytics/widgets";
import { Widget, type WidgetProps } from "@/shared/ui";
import { downloadExcel } from "@/shared/utils/excel";
import dayjs from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";

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
	const [type, setType] = useState(typeProp);
  const [_, update] = useWidgetParams()
	const formatedData = useRef<any[]>([])

	const memu = useMemo<any[]>(() => {
		const ret = []
		if (!allowChangeType) {
			return ret
		}
		return ret.concat(Object.entries({
			line: 'Линии',
			bar: 'Столбцы',
			stack: 'Столбцы (совмещённые)',
			table: 'Таблица',
			analytic: 'Аналитика',
		}).map(([value, label]) => ({
			children: label,
			color: type === value? "primary": '',
			onClick: () => {
				setType(value)
				update?.('type', value)
			},
		})));
	}, [allowChangeType, type])

	useEffect(() => {
		setQuery({ filterdate, step });
	}, [filterdate, step]);


	return (
		<Widget
			{...props}
			title='Сводный расход по событиям'
			subTitle={<>За <QueryShow {...query} /></>}
			menu={memu}
			onDownload={() => {
				if (!formatedData.current?.length) {
					alert('Нет данных для скачивания')
					return
				}
				const h: string[] = []
				formatedData.current.forEach((row) => {
					h.push(...Object.keys(row).filter((key) => key !== 'date' && key !== 'total'))
				})
				downloadExcel(formatedData.current.map(({date, total, ...row}) => {
					return {
						...row,
						"Дата": dayjs(date).format('DD.MM.YYYY'),
						"Всего": total,
					}
				}), 'printed', ['Дата', ...new Set(h), 'Всего'])
			}}
		>
			<AnalyticEvents
				{...query}
				events={events}
				type={type}
				stop={stop}
				percent={percent}
				onClick={onClick}
				onLoaded={(data) => {
					formatedData.current = data
				}}
			/>
		</Widget>
	);
};

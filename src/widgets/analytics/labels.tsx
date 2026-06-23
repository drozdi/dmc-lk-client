import { QueryShow } from "@/entites/analytics";
import { useWidgetParams } from "@/entites/dashboard";
import {
	AnalyticLabels,
	type AnalyticLabelsProps,
} from "@/features/analytics/widgets";
import { Widget, type WidgetProps } from "@/shared/ui";
import { notification } from "@/shared/notification/notification";
import { downloadExcel } from '@/shared/utils/excel';
import dayjs from "dayjs";
import { memo, useMemo, useRef, useState } from "react";

export interface WidgetAnalyticLabelsProps
	extends Omit<WidgetProps, "children" | "title">, AnalyticLabelsProps {
	title?: WidgetProps["title"];
	allowChangeType?: boolean
}

export const WidgetAnalyticLabels = memo(
	({
		title,
		filterdate,
		step = "d",
		event = "p",
		type: typeProp = "default",
		allowChangeType,
		...props
	}: WidgetAnalyticLabelsProps) => {
		const formatedData = useRef<any[]>([])

		const [type, setType] = useState<AnalyticLabelsProps['type']>(typeProp);
		const [_, update] = useWidgetParams()

		const computedTitle = useMemo(() => {
			if (title) {
				return title;
			}
			if (event === "d") {
				return "Дефекты при печати";
			} else if (event === "i") {
				return "Инциденты при печати";
			} else if (event === "v") {
				return "Проверено этикеток";
			}
			return "Напечатано этикеток";
		}, [title, event]);

		const memu = useMemo<any[]>(() => {
			const ret = []
			
			if (!allowChangeType) {
				return ret
			}
			return ret.concat(Object.entries({
				default: 'Разбивать',
				stack: 'Объединять',
				table: 'Таблица',
			}).map(([value, label]) => ({
				children: label,
				color: type === value? "primary": '',
				onClick: () => {
					setType(value as AnalyticLabelsProps['type'])
					update?.('type', value)
				},
			})));
		}, [allowChangeType, type])

		return (
			<Widget
				{...props}
				title={computedTitle}
				subTitle={<>За <QueryShow filterdate={filterdate} step={step} event={event} /></>}
				menu={memu}
				onDownload={() => {
					if (!formatedData.current?.length) {
						notification.alert("Нет данных для скачивания");
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
				<AnalyticLabels
					filterdate={filterdate}
					step={step}
					event={event}
					type={type}
					onLoaded={(data) => {
						formatedData.current = data
					}}
				/>
			</Widget>
		);
	},
);

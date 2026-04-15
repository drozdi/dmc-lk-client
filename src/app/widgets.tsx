import { useEnumsEvents, useEnumsStep } from "@/entites/analytics";
import { FactoryWidget } from "@/entites/widget/utils/factory-widget";
import {
	AnalyticAnalyticWidget,
	AnalyticEventWidget,
	AnalyticIncidentWidget,
	AnalyticPieWidget,
	AnalyticTypeWidget,
} from "@/widgets/analytics";
import { CountWidget } from "@/widgets/count-widget";
import { LabelsCountWidget } from "@/widgets/labels";
import { TesstWidget } from "@/widgets/test";

import { WidgetMainItogSet, WidgetMainType } from "@/widgets/main";

const es = useEnumsStep();
const ee = useEnumsEvents();

FactoryWidget.register({
	type: "test",
	component: TesstWidget,
	label: "Проба",
	description: "Описание",
	params: [
		{
			label: "Время загрузки",
			field: "timeout",
			type: "number",
			required: true,
		},
		{
			label: "Дата",
			field: "date",
			type: "date",
		},
		{
			label: "Заголовок",
			field: "title",
			type: "string",
		},
		{
			label: "Описание",
			field: "description",
			type: "text",
			description: "Содержимое виджета",
		},
	],
});

// FactoryWidget.register({
// 	type: "labels-count-widget",
// 	component: LabelsCountWidget,
// 	label: "Сводная история",
// 	description: "Сводная история (Description)",
// 	params: [],
// });

FactoryWidget.register({
	type: "main-type",
	component: WidgetMainType,
	label: "Информация, печати",
	description: "Информация, печати (Description)",
	params: [
		{
			label: "Промежуток",
			field: "filterdate",
			type: "range:date",
		},
		{
			label: "Шаг (разрез)",
			field: "step",
			type: "select",
			default: "d",
			data: es.dataSelect,
		},
		{
			label: "Тип",
			field: "type",
			type: "select",
			default: "default",
			data: [
				{
					label: "Разбивать",
					value: "default",
				},
				{
					label: "Объединять",
					value: "stack",
				},
			],
		},
	],
});

FactoryWidget.register({
	type: "main-itog-set",
	component: WidgetMainItogSet,
	label: "Итоговая информация",
	description: "Итоговая информация (Description)",
	params: [
		{
			label: "Промежуток",
			field: "filterdate",
			type: "range:date",
		},
		{
			label: "Событие",
			field: "event",
			type: "select",
			default: "d",
			data: ee.dataSelect,
		},
		{
			label: "Тип",
			field: "type",
			type: "select",
			default: "sum",
			data: [
				{
					label: "Сумма",
					value: "sum",
				},
				{
					label: "Минимальное",
					value: "min",
				},
				{
					label: "Максимальное",
					value: "max",
				},
				{
					label: "Среднее",
					value: "avg",
				},
			],
		},
	],
});

FactoryWidget.register({
	type: "analytic-event-widget",
	component: AnalyticEventWidget,
	label: "График событий",
	description: "График событий (Description)",
	params: [
		{
			label: "Промежуток",
			field: "filterdate",
			type: "range:date",
		},
		{
			label: "Шаг",
			field: "step",
			type: "select",
			data: es.dataSelect,
		},
	],
});
FactoryWidget.register({
	type: "analytic-pie-widget",
	component: AnalyticPieWidget,
	label: "Соотношение за",
	description: "Соотношение за (Description)",
	params: [
		{
			label: "Промежуток",
			field: "filterdate",
			type: "range:date",
		},
		{
			label: "Шаг",
			field: "step",
			type: "select",
			data: es.dataSelect,
		},
	],
});
FactoryWidget.register({
	type: "analytic-type-widget",
	component: AnalyticTypeWidget,
	label: "Напечатано за",
	description: "Напечатано за (Description)",
	params: [
		{
			label: "Промежуток",
			field: "filterdate",
			type: "range:date",
		},
		{
			label: "Шаг",
			field: "step",
			type: "select",
			data: es.dataSelect,
		},
	],
});
FactoryWidget.register({
	type: "analytic-analytic-widget",
	component: AnalyticAnalyticWidget,
	label: "Этикетки за последние 7 дней",
	description: "Этикетки за последние 7 дней (Description)",
	params: [],
});
FactoryWidget.register({
	type: "count-widget",
	component: CountWidget,
	label: "Расход этикеток",
	description: "Расход этикеток (Description)",
	params: [
		{
			label: "Промежуток",
			field: "filterdate",
			type: "range:date",
		},
		{
			label: "Шаг",
			field: "step",
			type: "select",
			data: es.dataSelect,
		},
		{
			label: "Событие",
			field: "event",
			type: "select",
			data: ee.dataSelect,
		},
	],
});
FactoryWidget.register({
	type: "labels-count-widget",
	component: LabelsCountWidget,
	label: "Сводная история",
	description: "Сводная история (Description)",
	params: [],
});
FactoryWidget.register({
	type: "analytic-incident-widget",
	component: AnalyticIncidentWidget,
	label: "Инциденты за",
	description: "Инциденты за (Description)",
	params: [
		{
			label: "Промежуток",
			field: "filterdate",
			type: "range:date",
		},
	],
});

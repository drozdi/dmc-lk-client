import { useEnumsEvents, useEnumsStep } from "@/entites/analytics";
import { FactoryWidget } from "@/entites/widget/utils/factory-widget";
import { WidgetAnalyticEvents } from "./events";
import { WidgetAnalyticItogSet } from "./itog-set";
import { WidgetAnalyticLabels } from "./labels";
import { WidgetAnalyticPie } from "./pie";
import { WidgetAnalyticType } from "./type";

const es = useEnumsStep();
const ee = useEnumsEvents();

FactoryWidget.register({
	type: "analytic-events",
	component: WidgetAnalyticEvents,
	label: "График за",
	description: "График за (Description)",
	params: [
		{
			label: "Промежуток",
			field: "filterdate",
			type: "date:range",
			required: true,
		},
		{
			label: "Шаг (разрез)",
			field: "step",
			type: "select",
			default: "d",
			data: es.dataSelect,
		},
		{
			label: "События",
			field: "events",
			type: "select:array",
			required: true,
			default: ["p"],
			data: ee.dataSelect,
		},
		{
			label: "Отображение",
			field: "type",
			type: "select",
			default: "line",
			data: [
				{
					label: "Линиями",
					value: "line",
				},
				{
					label: "Столбцами",
					value: "bar",
				},
				{
					label: "Таблицей",
					value: "table",
				},
				{
					label: "Аналитика",
					value: "analytic",
				},
			],
		},
		{
			label: "Разбивать до",
			field: "stop",
			type: "select",
			default: "m",
			data: [
				{
					label: "Секунд",
					value: "s",
				},
				{
					label: "Минут",
					value: "m",
				},
				{
					label: "Часов",
					value: "h",
				},
				{
					label: "Дней",
					value: "d",
				},
				{
					label: "Недель",
					value: "w",
				},
				{
					label: "Месяца",
					value: "mon",
				},
				{
					label: "Года",
					value: "y",
				},
			],
		},
	],
});
FactoryWidget.register({
	type: "analytic-pie",
	component: WidgetAnalyticPie,
	label: "Соотношение за",
	description: "Соотношение за (Description)",
	params: [
		{
			label: "Промежуток",
			field: "filterdate",
			type: "date:range",
			required: true,
		},
		{
			label: "События",
			field: "events",
			type: "select:array",
			required: true,
			default: ["v", "d", "i"],
			data: ee.dataSelect,
		},
	],
});
FactoryWidget.register({
	type: "analytic-type",
	component: WidgetAnalyticType,
	label: "Этикетки за",
	description: "Этикетки за (Description)",
	params: [
		{
			label: "Промежуток",
			field: "filterdate",
			type: "date:range",
			required: true,
		},
		{
			label: "Шаг (разрез)",
			field: "step",
			type: "select",
			default: "d",
			data: es.dataSelect,
		},
		{
			label: "Событие",
			field: "event",
			type: "select",
			default: "p",
			data: ee.dataSelect,
		},
	],
});
FactoryWidget.register({
	type: "analytic-itog-set",
	component: WidgetAnalyticItogSet,
	label: "Итоговая информация",
	description: "Итоговая информация (Description)",
	params: [
		{
			label: "Промежуток",
			field: "filterdate",
			type: "date:range",
			required: true,
		},
		{
			label: "Событие",
			field: "event",
			type: "select",
			default: "p",
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
	type: "analytic-labels",
	component: WidgetAnalyticLabels,
	label: "Информация о этикетках",
	description: "Информация о этикетках (Description)",
	params: [
		{
			label: "Промежуток",
			field: "filterdate",
			type: "date:range",
			required: true,
		},
		{
			label: "Шаг (разрез)",
			field: "step",
			type: "select",
			default: "d",
			data: es.dataSelect,
		},
		{
			label: "Событие",
			field: "event",
			type: "select",
			default: "p",
			data: ee.dataSelect,
		},
		{
			label: "Отображение",
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
				{
					label: "Таблица",
					value: "table",
				},
			],
		},
	],
});

export * from "./events";
export * from "./itog-set";
export * from "./labels";
export * from "./pie";
export * from "./type";

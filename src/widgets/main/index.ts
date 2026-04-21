import { useEnumsEvents, useEnumsStep } from "@/entites/analytics";
import { FactoryWidget } from "@/entites/widget/utils/factory-widget";
import { WidgetMainItogAnalytics } from "./itog-analytics";
import { WidgetMainItogSet } from "./itog-set";
import { WidgetMainLabels } from "./labels";

const es = useEnumsStep();
const ee = useEnumsEvents();

FactoryWidget.register({
	type: "main-labels",
	component: WidgetMainLabels,
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
FactoryWidget.register({
	type: "main-itog-set",
	component: WidgetMainItogSet,
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
	type: "main-itog-analytics",
	component: WidgetMainItogAnalytics,
	label: "Статистика работы",
	description: "Статистика работы (Description)",
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
			label: "Шаг (разрез)",
			field: "step",
			type: "select",
			default: "d",
			data: es.dataSelect,
		},
		{
			label: "Увеличивать до",
			field: "stop",
			type: "select",
			default: "m",
			data: ee.dataSelect,
		},
	],
});

export * from "./itog-analytics";
export * from "./itog-set";
export * from "./labels";

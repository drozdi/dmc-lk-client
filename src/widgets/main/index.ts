import { useEnumsEvents, useEnumsStep } from "@/entites/analytics";
import { FactoryWidget } from "@/entites/widget/utils/factory-widget";
import { WidgetMainItogAnalytics } from "./itog-analytics";
import { WidgetMainItogSet } from "./itog-set";
import { WidgetMainType } from "./type";

const es = useEnumsStep();
const ee = useEnumsEvents();

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
			type: "range:date",
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
	],
});

export * from "./itog-analytics";
export * from "./itog-set";
export * from "./type";

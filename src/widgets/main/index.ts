import { useEnumsEvents, useEnumsStep } from "@/entites/analytics";
import { FactoryWidget } from "@/entites/widget/utils/factory-widget";
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

export * from "./labels";

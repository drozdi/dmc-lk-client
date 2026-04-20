import { useEnumsEvents, useEnumsStep } from "@/entites/analytics";
import { FactoryWidget } from "@/entites/widget/utils/factory-widget";
import { WidgetLabelsEvent } from "./event";
import { WidgetLabelsPie } from "./pie";
import { WidgetLabelsType } from "./type";

const es = useEnumsStep();
const ee = useEnumsEvents();

FactoryWidget.register({
	type: "labels-pie",
	component: WidgetLabelsPie,
	label: "Соотношение за",
	description: "Соотношение за (Description)",
	params: [
		{
			label: "Промежуток",
			field: "filterdate",
			type: "date:range",
			required: true,
		},
	],
});
FactoryWidget.register({
	type: "labels-type",
	component: WidgetLabelsType,
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
	type: "labels-event",
	component: WidgetLabelsEvent,
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
			field: "event",
			type: "select:array",
			required: true,
			default: ["p"],
			data: ee.dataSelect,
		},
		{
			label: "Отображение",
			field: "type",
			type: "select",
			default: "bar",
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
			],
		},
	],
});

export * from "../analytics/count";
export * from "./event";
export * from "./pie";
export * from "./type";

import { useEnumsEvents, useEnumsStep } from "@/entites/analytics";
import { FactoryWidget } from "@/entites/widget/utils/factory-widget";
import { WidgetLabelsCount } from "./count";
import { WidgetLabelsEvent } from "./event";
import { WidgetAnalyticPie } from "./pie";
import { WidgetLabelsType } from "./type";

const es = useEnumsStep();
const ee = useEnumsEvents();

FactoryWidget.register({
	type: "labels-count",
	component: WidgetLabelsCount,
	label: "Сводная история",
	description: "Сводная история (Description)",
	params: [],
});
FactoryWidget.register({
	type: "labels-pie",
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
	],
});

export * from "./count";
export * from "./event";
export * from "./pie";
export * from "./type";

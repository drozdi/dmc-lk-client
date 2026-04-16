import { useEnumsEvents, useEnumsStep } from "@/entites/analytics";
import { FactoryWidget } from "@/entites/widget/utils/factory-widget";
import { WidgetAnalyticPie } from "./pie";

const es = useEnumsStep();
const ee = useEnumsEvents();

FactoryWidget.register({
	type: "analytic-pie",
	component: WidgetAnalyticPie,
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

export * from "./analytic-analytic-widget";
export * from "./analytic-event-widget";
export * from "./analytic-incident-widget";
export * from "./analytic-type-widget";
export * from "./pie";

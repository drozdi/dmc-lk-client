import { useEnumsEvents, useEnumsStep } from "@/entites/analytics";
import { FactoryWidget } from "@/entites/widget/utils/factory-widget";
import { WidgetAnalyticIncident } from "./incident";

const es = useEnumsStep();
const ee = useEnumsEvents();

FactoryWidget.register({
	type: "analytics-incident",
	component: WidgetAnalyticIncident,
	label: "Инциденты за",
	description: "Инциденты за (Description)",
	params: [
		{
			label: "Промежуток",
			field: "filterdate",
			type: "date:range",
			required: true,
		},
	],
});

export * from "./analytic-analytic-widget";
export * from "./analytic-incident-widget";
export * from "./incident";

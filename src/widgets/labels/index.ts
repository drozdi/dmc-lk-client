import { useEnumsEvents, useEnumsStep } from "@/entites/analytics";
import { FactoryWidget } from "@/entites/widget/utils/factory-widget";

import { WidgetAnalyticsCount } from "./count";
import { WidgetLabelsCurrentBalance } from "./current-balance";
import { WidgetAnalyticsIncident } from "./incident";

const es = useEnumsStep();
const ee = useEnumsEvents();

FactoryWidget.register({
	type: "labels-current-balance",
	component: WidgetLabelsCurrentBalance,
	label: "Текущее количество",
	description: "Текущее количество (Description)",
	params: [
		{
			label: "Что",
			field: "type",
			type: "select",
			required: true,
			default: "cnt",
			data: [
				{
					value: "cnt",
					label: "Количество этикеток",
				},
				{
					value: "reb",
					label: "Длина ленты",
				},
			],
		},
	],
});

///////////
FactoryWidget.register({
	type: "analytics-incident",
	component: WidgetAnalyticsIncident,
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

FactoryWidget.register({
	type: "analytics-count",
	component: WidgetAnalyticsCount,
	label: "Сводная история",
	description: "Сводная история (Description)",
	params: [],
});

export * from "./count";
export * from "./incident";

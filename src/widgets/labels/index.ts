import { eventsDataSelect, stepDataSelect } from "@/entites/analytics";
import { FactoryWidget } from "@/entites/dashboard/utils/factory-widget";
import { WidgetAnalyticsCount } from "./count";
import { WidgetLabelsCurrentBalance } from "./current-balance";

const es = { dataSelect: stepDataSelect };
const ee = { dataSelect: eventsDataSelect };

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
	type: "analytics-count",
	component: WidgetAnalyticsCount,
	label: "Сводная история",
	description: "Сводная история (Description)",
	params: [],
});

export * from "./count";


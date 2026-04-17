import { useEnumsEvents, useEnumsStep } from "@/entites/analytics";
import { FactoryWidget } from "@/entites/widget/utils/factory-widget";
import "@/widgets/analytics";
import {
	AnalyticAnalyticWidget,
	AnalyticIncidentWidget,
} from "@/widgets/analytics";
import { CountWidget } from "@/widgets/count-widget";
import "@/widgets/labels";
import "@/widgets/main";
import { TesstWidget } from "@/widgets/test";

const es = useEnumsStep();
const ee = useEnumsEvents();

FactoryWidget.register({
	type: "count-widget",
	component: CountWidget,
	label: "Расход этикеток",
	description: "Расход этикеток (Description)",
	params: [
		{
			label: "Промежуток",
			field: "filterdate",
			type: "date:range",
		},
		{
			label: "Шаг",
			field: "step",
			type: "select",
			data: es.dataSelect,
		},
		{
			label: "Событие",
			field: "event",
			type: "select",
			data: ee.dataSelect,
		},
	],
});

FactoryWidget.register({
	type: "analytic-analytic-widget",
	component: AnalyticAnalyticWidget,
	label: "Этикетки за последние 7 дней",
	description: "Этикетки за последние 7 дней (Description)",
	params: [],
});
FactoryWidget.register({
	type: "analytic-incident-widget",
	component: AnalyticIncidentWidget,
	label: "Инциденты за",
	description: "Инциденты за (Description)",
	params: [
		{
			label: "Промежуток",
			field: "filterdate",
			type: "date:range",
		},
	],
});

FactoryWidget.register({
	type: "test",
	component: TesstWidget,
	label: "Проба",
	description: "Описание",
	params: [
		{
			label: "Время загрузки",
			field: "timeout",
			type: "number",
			required: true,
		},
		{
			label: "Дата",
			field: "date",
			type: "date",
		},
		{
			label: "Заголовок",
			field: "title",
			type: "string",
		},
		{
			label: "Описание",
			field: "description",
			type: "text",
			description: "Содержимое виджета",
		},
	],
});

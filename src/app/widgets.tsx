import { useEnumsEvents, useEnumsStep } from "@/entites/analytics";
import { FactoryWidget } from "@/entites/dashboard/utils/factory-widget";
import "@/widgets/analytics";
import { WidgetCount } from "@/widgets/count-widget";
import "@/widgets/labels";
import { TestWidget } from "@/widgets/test";

const es = useEnumsStep();
const ee = useEnumsEvents();

FactoryWidget.register({
	type: "count",
	component: WidgetCount,
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
	type: "test",
	component: TestWidget,
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

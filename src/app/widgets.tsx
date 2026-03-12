import { FactoryWidget } from "@/entites/widget/utils/factory-widget";
import { CountWidget } from "@/widgets/count-widget";
import { LabelsCountWidget } from "@/widgets/labels/labels-count-widget";
import { TesstWidget } from "@/widgets/test";

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

FactoryWidget.register({
	type: "labels-count-widget",
	component: LabelsCountWidget,
	label: "Сводная история",
	description: "Сводная история (Description)",
	params: [],
});

FactoryWidget.register({
	type: "count-widget",
	component: CountWidget,
	label: "Расход этикеток",
	description: "Расход этикеток (Description)",
	params: [],
});

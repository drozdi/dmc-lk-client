import { FactoryWidget } from "@/entites/widget/utils/factory-widget";
import { AnalyticPieWidget } from "@/widgets/analytics";
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

FactoryWidget.register({
	type: "analytic-pie-widget",
	component: AnalyticPieWidget,
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
			data: [
				{
					label: "Секунда",
					value: "s",
				},
				{
					label: "Минута",
					value: "m",
				},
				{
					label: "Час",
					value: "h",
				},
				{
					label: "День",
					value: "d",
				},
				{
					label: "Месяц",
					value: "mon",
				},
				{
					label: "Год",
					value: "y",
				},
			],
		},
	],
});
//"s" | "m" | "h" | "d" | "mon" | "y"

// FactoryWidget.register({
// 	type: "labels-count-widget",
// 	component: LabelsCountWidget,
// 	label: "Сводная история",
// 	description: "Сводная история (Description)",
// 	params: [],
// });

// FactoryWidget.register({
// 	type: "count-widget",
// 	component: CountWidget,
// 	label: "Расход этикеток",
// 	description: "Расход этикеток (Description)",
// 	params: [],
// });

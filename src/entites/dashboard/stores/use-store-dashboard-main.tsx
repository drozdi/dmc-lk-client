import { TesstWidget } from "@/widgets/test";
import { factoryDashboardStore } from "../utils";

export const useStoreDashboardMain = factoryDashboardStore({
	storageKey: "main",
	key: "i",
	availableWidgets: {
		test: {
			type: "test",
			component: TesstWidget,
			label: "Проба",
			description: "Описание",
			params: [
				{
					label: "Время загрузки",
					field: "timeout",
					type: "number",
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
				},
			],
		},
	},
});

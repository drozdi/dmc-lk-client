import { factoryDashboardStore } from "../utils";

export const useStoreDashboardMain = factoryDashboardStore({
	storageKey: "main",
	key: "i",
	availableWidgets: [
		"test",
		"analytic-event-widget",
		"analytic-type-widget",
		"analytic-analytic-widget",
		"analytic-pie-widget",
		"analytic-incident-widget",
		"labels-count-widget",
		"count-widget",
	],
	varibles: {
		$filterdate: {
			label: "Диапозон времени",
			type: "range:date",
			default: "",
			required: false,
		},
	},
});

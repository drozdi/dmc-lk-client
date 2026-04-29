import { factoryDashboardStore } from "../utils";

export const useStoreDashboardMain = factoryDashboardStore({
	storageKey: "main",
	key: "i",
	availableWidgets: [
		"analytic-events",
		"analytic-type",
		"analytic-pie",
		"analytic-itog-set",
		"analytic-labels",
		"labels-count",
	],
	varibles: {
		$filterdate: {
			label: "Время на главной странице",
			type: "date:range",
			default: [null, null],
			required: false,
		},
	},
});

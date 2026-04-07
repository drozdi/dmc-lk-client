import { factoryDashboardStore } from "../utils";

export const useStoreDashboardMain = factoryDashboardStore({
	storageKey: "main",
	key: "i",
	availableWidgets: ["test", "analytic-pie-widget"],
	varibles: {
		$filterdate: {
			label: "Диапозон времени",
			type: "range:date",
			default: "",
			required: false,
		},
	},
});

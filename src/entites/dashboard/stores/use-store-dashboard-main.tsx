import { factoryDashboardStore } from "../utils";

export const useStoreDashboardMain = factoryDashboardStore({
	storageKey: "main",
	key: "i",
	availableWidgets: ["test", "labels-count-widget", "count-widget"],
});

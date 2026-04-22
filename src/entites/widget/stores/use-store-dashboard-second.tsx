import dayjs from "dayjs";
import { factoryDashboardStore } from "../utils";

const nDate = dayjs();

export const useStoreDashboardSecond = factoryDashboardStore({
	storageKey: "second",
	key: "i",
	availableWidgets: [
		"test",
		"analytic-analytic-widget",
		"analytic-incident-widget",
		"count-widget",

		"labels-type",
		"labels-pie",
		"labels-count",
		"labels-events",
	],
	varibles: {
		$filterdate: {
			label: "Диапозон времени",
			type: "date:range",
			default: [nDate.day(-7).format("YYYY-MM-DD"), nDate.format("YYYY-MM-DD")],
			required: false,
		},
	},
});

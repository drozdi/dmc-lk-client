import dayjs from "dayjs";
import { factoryDashboardStore } from "../utils";

const nDay = dayjs();

export const useStoreDashboardSecond = factoryDashboardStore({
	storageKey: "second",
	key: "i",
	availableWidgets: [
		"test",
		"analytic-analytic-widget",
		"analytic-incident-widget",
		"count-widget",

		"analytic-type",
		"analytic-pie",
		"labels-count",
		"analytic-events",
	],
	varibles: {
		$filterdate: {
			label: "Диапозон времени",
			type: "date:range",
			default: [
				nDay.subtract(7, "d").format("YYYY-MM-DD"),
				nDay.format("YYYY-MM-DD"),
			],
			required: false,
		},
	},
});

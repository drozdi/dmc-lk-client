import dayjs from "dayjs";
import { factoryDashboardStore } from "../utils";

const nDay = dayjs();

export const useStoreDashboardSecond = factoryDashboardStore({
	storageKey: "second",
	key: "i",
	availableWidgets: [
		'*',
		"analytic-events",
		"analytic-pie",
		"analytic-type",
		"analytic-itog-set",
		"analytic-labels",
		"analytic-event-defect",
		"analytic-incident",

		"analytic-incident-widget",
		"count-widget",
		"labels-count",
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

import dayjs from "dayjs";
import { factoryDashboardStore } from "../utils";

const nDay = dayjs();

export const useStoreDashboardMain = factoryDashboardStore({
	storageKey: "main",
	key: "i",
	availableWidgets: [
		'*',
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
			default: [
				nDay.subtract(7, "d").format("YYYY-MM-DD"),
				nDay.format("YYYY-MM-DD"),
			],
			required: false,
		},
	},
});

import dayjs from "dayjs";
import { factoryDashboardStore } from "../utils";

const nDate = dayjs();

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
			default: [nDate.day(-7).format("YYYY-MM-DD"), nDate.format("YYYY-MM-DD")],
			required: false,
		},
	},
});

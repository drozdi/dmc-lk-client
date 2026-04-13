import dayjs from "dayjs";
import { factoryDashboardStore } from "../utils";

const nDate = dayjs();

export const useStoreDashboardMain = factoryDashboardStore({
	storageKey: "main",
	key: "i",
	availableWidgets: ["main-itog-set"],
	varibles: {
		$filterdate: {
			label: "Диапозон времени",
			type: "range:date",
			default: [nDate.day(-7).format("YYYY-MM-DD"), nDate.format("YYYY-MM-DD")],
			required: false,
		},
	},
});

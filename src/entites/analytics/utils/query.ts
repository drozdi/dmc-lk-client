import { type DateValue } from "@mantine/dates";
import dayjs from "dayjs";

function getStep(filterdate: [DateValue, DateValue]): SliceStep {
	const d = dayjs(filterdate[1]).diff(dayjs(filterdate[0]), "d");
	if (d > 30) {
		return "mon";
	}
	if (d > 7) {
		return "w";
	}
	if (d > 1) {
		return "d";
	}
	const s = dayjs(filterdate[1]).diff(dayjs(filterdate[0]), "s");
	if (s > 3600) {
		return "h";
	}
	if (s > 60) {
		return "m";
	}
	return "s";
}

export function corectQuery(state: IRequestAnalytics): IRequestAnalytics {
	return {
		...state,
		step: getStep(state.filterdate),
	};
}

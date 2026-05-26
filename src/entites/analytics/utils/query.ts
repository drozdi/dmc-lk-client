import { type DateValue } from "@mantine/dates";
import dayjs, { type OpUnitType } from "dayjs";

function getStep(filterdate: [DateValue, DateValue]): SliceStep {
	if (!filterdate?.[0]) {
		return "d";
	}
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

// export function corectQuery(state: IRequestAnalytics): IRequestAnalytics {
// 	return {
// 		...state,
// 		step: getStep(state.filterdate) === '',
// 	};
// }

export function corectQuery(state: IRequestAnalytics): IRequestAnalytics {
	const step =
		getStep(state.filterdate) === "mon" ? "M" : getStep(state.filterdate);
	const filterdate = state.filterdate;
	const format = "YYYY-MM-DD" + (
		step === 'h'? 
			' HH:00:00': 
			step === 'm'? 
				' HH:mm:00': 
				step === 's'? 
					' HH:mm:ss': 
					'')
	filterdate[0] = dayjs(filterdate[0]).startOf(step as OpUnitType).format(format);
	filterdate[1] = dayjs(filterdate[1]).endOf(step as OpUnitType).format(format);
	return {
		...state,
		step: step === "M" ? "mon" : step,
		filterdate,
	};
}

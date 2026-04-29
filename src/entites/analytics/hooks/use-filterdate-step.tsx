import dayjs from "dayjs";
import { useMemo } from "react";

export function useFilterdateStep(query: IRequestAnalytics) {
	return useMemo<string[]>(() => {
		const step = query.step === "mon" ? "M" : query.step;
		const s = dayjs(query.filterdate?.[0]).startOf(step);
		const e = dayjs(query.filterdate?.[1]).startOf(step);
		const cnt = dayjs(e).diff(s, step);
		const labels: string[] = [];
		for (let i = 0; i <= cnt; i++) {
			if (step === "h") {
				labels.push(s.add(i, "h").format("HH"));
			} else if (step === "m") {
				labels.push(s.add(i, "m").format("mm"));
			} else {
				labels.push(s.add(i, step).format("YYYY-MM-DD"));
			}
		}
		return labels;
	}, [query.filterdate, query.step]);
}

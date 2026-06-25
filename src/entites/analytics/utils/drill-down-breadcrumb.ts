import { $setting } from "@/shared";
import dayjs from "dayjs";

export function formatDrillDownSegment(query: IRequestAnalytics): string {
	const from = query.filterdate?.[0];
	if (!from) {
		return "";
	}

	switch (query.step) {
		case "y":
			return dayjs(from).format("YYYY");
		case "mon":
			return dayjs(from).format("MMMM YYYY");
		case "w":
			return `Неделя ${dayjs(from).week()}`;
		case "d":
			return dayjs(from).format($setting.get("formatDate"));
		case "h":
			return dayjs(from).format("HH:00");
		case "m":
			return dayjs(from).format("HH:mm");
		case "s":
			return dayjs(from).format("HH:mm:ss");
		default:
			return dayjs(from).format($setting.get("formatDate"));
	}
}

export function formatDrillDownBreadcrumb(
	history: IRequestAnalytics[],
	current: IRequestAnalytics,
): string {
	const segments = [...history, current]
		.map(formatDrillDownSegment)
		.filter(Boolean);

	return segments.join(" → ");
}

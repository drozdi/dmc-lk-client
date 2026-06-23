import dayjs from "dayjs";

export function buildIncidentReportUrl({
	filterdate,
	data,
	tab = "generate",
}: {
	filterdate: [string | Date | null, string | Date | null];
	data?: string | string[];
	tab?: "detail" | "generate";
}) {
	const params = new URLSearchParams();

	const from = dayjs(filterdate[0]).format("YYYY-MM-DD");
	const to = dayjs(filterdate[1]).format("YYYY-MM-DD");

	params.set("from", from);
	params.set("to", to);
	params.set("tab", tab);

	const dataFilters = Array.isArray(data) ? data : data ? [data] : [];
	dataFilters.filter(Boolean).forEach((item) => params.append("data", item));

	return `/analytics/incident?${params.toString()}`;
}

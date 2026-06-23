import dayjs from "dayjs";

function formatFilterDateValue(
	value: string | Date | null | undefined,
): string {
	if (!value) {
		return "";
	}

	return dayjs(value).format("YYYY-MM-DD");
}

function normalizeData(data?: string | string[]): string[] {
	if (!data) {
		return [];
	}

	return Array.isArray(data) ? data.filter(Boolean) : [data].filter(Boolean);
}

export function normalizeIncidentParams(
	params: Partial<IRequestAnalyticsIncident> = {},
): IRequestAnalyticsIncident | null {
	const filterdate: [string, string] = [
		formatFilterDateValue(params.filterdate?.[0]),
		formatFilterDateValue(params.filterdate?.[1]),
	];
	
	if (!filterdate[0] || !filterdate[1]) {
		return null;
	}

	return {
		filterdate,
		data: normalizeData(params.data),
		fields_name: params.fields_name ?? [],
	};
}

export function getIncidentQueryKey(
	params: IRequestAnalyticsIncident | null,
): readonly unknown[] {
	if (!params) {
		return ["incident", "idle"] as const;
	}

	return [
		"incident",
		params.filterdate[0],
		params.filterdate[1],
		...params.data,
		...params.fields_name,
	] as const;
}

export function serializeIncidentParamsKey(
	params: Partial<IRequestAnalyticsIncident> = {},
): string {
	return getIncidentQueryKey(normalizeIncidentParams(params)).join("|");
}

export function isIncidentParamsReady(
	params: Partial<IRequestAnalyticsIncident> | null | undefined,
): params is IRequestAnalyticsIncident {
	return normalizeIncidentParams(params ?? {}) !== null;
}

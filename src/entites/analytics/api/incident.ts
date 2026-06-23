import { api } from "@/shared/api";
import { normalizeIncidentParams } from "../utils/incident-query";

const EMPTY_RESPONSE: IResponseAnalyticsIncident = {
	success: true,
	message: null,
	data: [],
	len_answer: 0,
	response: [],
};

export async function requestAnalyticsIncident(
	params: Partial<IRequestAnalyticsIncident>,
): Promise<IResponseAnalyticsIncident> {
	const normalized = normalizeIncidentParams(params);

	if (!normalized) {
		return EMPTY_RESPONSE;
	}

	const arr: string[] = [];

	for (const key in normalized) {
		const value = normalized[key as keyof IRequestAnalyticsIncident];

		if (Array.isArray(value)) {
			value.forEach((item) => {
				if (item) {
					arr.push(`${key}=${encodeURIComponent(String(item))}`);
				}
			});
			continue;
		}

		if (value) {
			arr.push(`${key}=${encodeURIComponent(String(value))}`);
		}
	}

	const res = await api.get(`/analytics/incident?${arr.join("&")}`);
	return res.data;
}

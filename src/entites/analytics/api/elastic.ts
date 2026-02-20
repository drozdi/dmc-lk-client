import { api } from "@/shared/api";

export async function requestAnalyticsElastic(
	params: IAnalyticsElasticQuery,
): Promise<IResponseAnalyticsElastic> {
	return (await api.post("/analytics/elastic", params)).data;
}

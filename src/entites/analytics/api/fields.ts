import { api } from "@/shared/api";

export async function requestAnalyticsFields(): Promise<
	IResponse<IResponseAnalyticsFields>
> {
	return (await api.get("/analytics/available_fields")).data;
}

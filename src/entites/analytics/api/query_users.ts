import { api } from "@/shared/api";

export async function requestAnalyticsQueriesList(
	params: IRequestList = {},
): Promise<IResponseList<IAnalyticsElastic>> {
	params.size = params.size || 100;
	params.number = params.number || 0;
	const res = await api.get("/query_users/", {
		params,
	});
	return res.data;
}

export async function requestAnalyticsQueriesGet(
	id: IAnalyticsElastic["id"],
): Promise<IResponse<IAnalyticsElastic>> {
	const res = await api.get(`/query_users/query_id?id_query=${id}`);
	return res.data;
}

export async function requestAnalyticsQueriesUpdate({
	id,
	name_query,
	...data
}: Partial<IAnalyticsElastic>): Promise<IResponse<IAnalyticsElastic>> {
	const res = await api.patch(
		`/query_users/?id_record=${id}&name_query=${name_query}`,
		data,
	);
	return res.data;
}
export async function requestAnalyticsQueriesDelete(
	id: IAnalyticsElastic["id"],
): Promise<IResponse<string>> {
	const res = await api.delete(`/query_users/?id_record=${id}`);
	return res.data;
}

export async function requestAnalyticsQueriesAdd({
	name_query,
	...data
}: Partial<IAnalyticsElastic>): Promise<IResponse<IAnalyticsElastic>> {
	const res = await api.post(
		`/query_users/save_query?name_query=${name_query}`,
		data,
	);
	return res.data;
}

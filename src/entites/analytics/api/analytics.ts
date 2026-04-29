import { api } from "@/shared/api";

export async function requestAnalytics(
	params: IRequestAnalytics,
): Promise<IResponse<IResponseAnalytics>> {
	const arr = [];
	for (const key in params) {
		if (Array.isArray(params[key as keyof IRequestAnalytics])) {
			(params[key as keyof IRequestAnalytics] as string[]).forEach(
				function (item) {
					if (item) {
						arr.push(key + "=" + item);
					}
				},
			);
		} else if (params[key as keyof IRequestAnalytics]) {
			arr.push(key + "=" + params[key as keyof IRequestAnalytics]);
		}
	}
	const res = await api.get(`/analytics/?${arr.join("&")}`);
	return res.data;
}

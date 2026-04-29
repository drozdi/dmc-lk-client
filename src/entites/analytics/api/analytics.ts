import { api } from "@/shared/api";

export async function requestAnalytics(
	params: IRequestAnalytics,
): Promise<IResponse<IResponseAnalytics>> {
	const arr = [];
	if (
		!params.filterdate ||
		!params.filterdate?.[0] ||
		!params.filterdate?.[1] ||
		!params.event ||
		!params.step
	) {
		return {
			success: false,
	message: '',
	data:{
				id: 0,
				all_records: 0,
				sum_company: 0,
				min_company: 0,
				max_company: 0,
				average_company: 0,
				production: [],
			},
	response: {
				id: 0,
				all_records: 0,
				sum_company: 0,
				min_company: 0,
				max_company: 0,
				average_company: 0,
				production: [],
			},
		};
	}
	console.log(params);
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

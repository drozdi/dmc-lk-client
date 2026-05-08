import { api } from "@/shared/api";

export async function requestLabelsReset(
	production_id: ILabel["production_id"],
) {
	const res = await api.get("/count_label/reset/", {
		params: { production_id },
	});
	return res.data;
}

export async function requestLabelsHistory(
	params: Partial<IRequestCountLabelHistory> = {},
): Promise<IResponseList<ICountLabelHistoryItem>> {
	params.size = params.size || 100;
	params.number = params.number || 0;
	const arr = [];
	for (const key in params) {
		if (Array.isArray(params[key as keyof IRequestCountLabelHistory])) {
			(params[key as keyof IRequestCountLabelHistory] as string[]).forEach(
				function (item) {
					if (item) {
						arr.push(key + "=" + item);
					}
				},
			);
		} else if (params[key as keyof IRequestCountLabelHistory]) {
			arr.push(key + "=" + params[key as keyof IRequestCountLabelHistory]);
		}
	}
	const res = await api.get(`/count_label/history?${arr.join("&")}`);
	return res.data;
}

export async function requestLabelsCount(): Promise<
	IResponse<{
		distributed: ICountLabelItem[];
		not_distributed: ICountLabelItem[];
	}>
> {
	const res = await api.get("/count_label/");
	return res.data;
}

export async function requestLabelsCountAdd(
	data: IRequestCountLabelAdd,
): Promise<IResponse<ICountLabelHistoryItem>> {
	data.place_name = data.place_name || "Пополнение этикеток";
	const res = await api.post("/count_label/", data);
	return res.data;
}

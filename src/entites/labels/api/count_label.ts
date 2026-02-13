import { api } from "@/shared/api";

export async function requestLabelsCountReset(
	production_id: ILabel["production_id"],
) {
	const res = await api.get("/count_label/reset/", {
		params: { production_id },
	});
	return res.data;
}

export async function requestLabelsCountHistory({
	size = 100,
	number = 0,
	filterdate = [],
}: IRequestCountLabelHistory = {}): Promise<
	IResponseObject<ICountLabelHistoryItem[]>
> {
	const arr = ["size=" + size, "number=" + number];
	if (Array.isArray(filterdate)) {
		filterdate.forEach((item) => {
			item && arr.push("filterdate=" + item);
		});
	} else if (filterdate) {
		arr.push(`filterdate=${filterdate}`);
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
): Promise<IResponse<ICountLabelItem>> {
	data.place_name = data.place_name || "Пополнение этикеток";
	const res = await api.post("/count_label/", data);
	return res.data;
}

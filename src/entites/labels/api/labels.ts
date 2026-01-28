import { api } from "@/shared/api";

export async function requestLabelsPrintAll(): Promise<
	IResponse<Record<string, string[]>>
> {
	const res = await api.get("/label/all_print_format");
	return res.data;
}

export async function requestLabelsFormatAll(): Promise<
	IResponse<Record<string, string[]>>
> {
	const res = await api.get("/label/all_format");
	return res.data;
}
export async function requestLabelsFormatAdd({
	format,
	production_id,
}: {
	format: string;
	production_id: number;
}): Promise<IResponse<ILabel>> {
	const res = await api.post("/label/new_format", {
		add_label_format: format,
		production_id,
	});
	return res.data;
}

export async function requestLabelsJoinedList({
	size = 100,
	number = 0,
}: {
	size?: number;
	number?: number;
}): Promise<IResponseObject<ILabel[]>> {
	const res = await api.get(`/label/?size=${size}&number=${number}`);
	return res.data;
}
export async function requestLabelsJoinedAdd(
	data: Partial<ILabel>,
): Promise<IResponse<ILabel>> {
	const res = await api.post("/label/", data);
	return res.data;
}

export async function requestLabelsJoinedUpdate(
	id: number,
	data: Partial<ILabel>,
) {
	const res = await api.patch(`/label/${id}`, data);
	return res.data;
}
export async function requestLabelsJoinedDelete(
	id: ILabel["id"] | ILabel["id"][],
) {
	const res = await api.delete("/label/", {
		data: {
			id_rel_label: [].concat(id as never),
		},
	});
	return res.data;
}

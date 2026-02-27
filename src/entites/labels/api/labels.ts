import { api } from "@/shared/api";

export async function requestLabelsPrintList(): Promise<
	IResponse<
		Record<ILabel["production_id"], ILabel["statistics_print_format"][]>
	>
> {
	const res = await api.get("/label/print");
	return res.data;
}

export async function requestLabelsFormatList(): Promise<
	IResponse<Record<ILabel["production_id"], ILabel["add_label_format"][]>>
> {
	const res = await api.get("/label/format");
	return res.data;
}
export async function requestLabelsFormatAdd({
	format,
	production_id,
}: {
	format: ILabel["add_label_format"];
	production_id: ILabel["production_id"];
}): Promise<IResponse<ILabel>> {
	const res = await api.post("/label/format", {
		add_label_format: format,
		production_id,
	});
	return res.data;
}
export async function requestLabelsFormatDelete({
	format,
	production_id,
}: {
	format: ILabel["add_label_format"] | ILabel["add_label_format"][];
	production_id: ILabel["production_id"];
}): Promise<IResponse<ILabel>> {
	const res = await api.delete("/label/format", {
		data: {
			name_label: [].concat(format as never),
			production_id,
		},
	});
	return res.data;
}

export async function requestLabelsJoinedList({
	size = 100,
	number = 0,
}: {
	size?: number;
	number?: number;
}): Promise<IResponseList<ILabel>> {
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
	id: ILabel["id"],
	data: Partial<ILabel>,
): Promise<IResponse<ILabel>> {
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

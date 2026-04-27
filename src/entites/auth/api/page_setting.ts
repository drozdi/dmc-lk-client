import { api } from "@/shared/api";

export async function requestPageSettingList(
	params: Partial<IRequestList> = {},
): Promise<IResponseList<ISetting>> {
	params.size = params.size || 100;
	params.number = params.number || 0;
	const res = await api.get("/page_setting/", {
		params,
	});
	return res.data;
}

export async function requestPageSettingGet(
	setting_name: ISetting["setting_name"],
): Promise<IResponse<ISetting>> {
	const res = await api.get(`/page_setting/?setting_name=${setting_name}`);
	return res.data;
}

export async function requestPageSettingAdd(
	data: ISetting | Partial<ISetting>,
): Promise<IResponse<ISetting>> {
	const res = await api.post(`/page_setting/`, data);
	return res.data;
}

export async function requestPageSettingUpdate(
	setting_name: ISetting["setting_name"],
	data: ISetting | Partial<ISetting>,
): Promise<IResponse<ISetting>> {
	const res = await api.patch(`/page_setting/`, { ...data, setting_name });
	return res.data;
}

export async function requestPageSettingDelete(
	id: ISetting["id"],
): Promise<IResponse<string>> {
	const res = await api.delete(`/page_setting/${id}`);
	return res.data;
}

import { api } from "@/shared/api";

export async function requestUsersPlaceList(params: {
	production_id?: IPlace["production_id"] | IPlace["production_id"];
	[key: string]: any
} = {}): Promise<IResponse<IPlace[]>> {
	const arr = [];
	for (const key in params) {
		if (Array.isArray(params[key])) {
			(params[key as keyof IPlace] as IPlace["production_id"][]).forEach(
				function (item) {
					if (item) {
						arr.push(key + "=" + item);
					}
				},
			);
		} else if (params[key as keyof IPlace]) {
			arr.push(key + "=" + params[key as keyof IPlace]);
		}
	}

	const res = await api.get(`/users/place?${arr.join("&")}`);
	return res.data;
}

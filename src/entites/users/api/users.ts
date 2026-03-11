import { api } from "@/shared/api";

export async function requestUsersList(
	params: Partial<IRequestList> = {},
): Promise<IResponseList<IUsersUser>> {
	params.size = params.size || 15;
	params.number = params.number || 0;
	const res = await api.get("/users/", {
		params,
	});
	return res.data;
}

export async function requestUsersGet(
	id: IUsersUser["id"],
): Promise<IResponse<IUsersUser>> {
	const res = await api.get(`/users/${id}`);
	return res.data;
}

export async function requestUsersUpdate(
	id: IUsersUser["id"],
	data: IUsersUser | Partial<IUsersUser>,
): Promise<IResponse<IUsersUser>> {
	const res = await api.patch(`/users/${id}`, data);
	return res.data;
}

export async function requestUsersDelete(
	id: IUsersUser["id"],
): Promise<IResponse<string>> {
	const res = await api.delete(`/users/${id}`);
	return res.data;
}

export async function requestUsersProducts(): Promise<
	IResponse<IProduction[]>
> {
	const res = await api.get("/users/products");
	return res.data;
}

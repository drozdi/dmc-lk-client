import { api } from "@/shared/api";

export async function requestUsersList(
	params: IRequestList = {},
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
	const res = await api.get(`/users/user?id_user=${id}`);
	return res.data;
}
export async function requestUsersUpdate(
	id: number,
	data: Omit<IUsersUser, "id">,
): Promise<IResponse<IUsersUser>> {
	console.log(data);
	const res = await api.patch(`/users/?id_user=${id}`, data);
	return res.data;
}

export async function requestUsersProducts(): Promise<
	IResponse<IProduction[]>
> {
	const res = await api.get("/users/products");
	return res.data;
}

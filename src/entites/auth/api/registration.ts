import { api } from "@/shared/api";

export async function requestRegistrationLogin(credentials: {
	email: string;
	password: string;
}): Promise<
	IResponse<{
		token: {
			access: string;
			refresh: string;
		};
	}>
> {
	const res = await api.post("/registration/authorization", credentials);
	return res.data;
}
export async function requestRegistrationVerification(link: string) {
	const res = await api.get("/registration/verification", {
		params: { link },
	});
	return res.data;
}
export async function requestRegistrationRegister(userData: IUser) {
	const res = await api.post("/registration/save_data", userData);
	return res.data;
}
export async function requestRegistrationRefresh(refreshToken: string): Promise<
	IResponse<{
		token: {
			access: string;
			refresh: string;
		};
	}>
> {
	const res = await api.post("/registration/refresh", {
		refresh_token: refreshToken,
	});
	return res.data;
}

import { api } from "@/shared/api";

export async function requestUserProfileGet(): Promise<
	IResponse<{
		user: IUserInfo;
	}>
> {
	const res = await api.get("/user_profile/");
	return res.data;
}

export async function requestUserProfileDelete() {
	const res = await api.delete("/user_profile/");
	return res.data;
}

export async function requestUserProfileUpdate(userData: IUserInfo) {
	const res = await api.patch("/user_profile/", userData);
	return res.data;
}

export async function requestUserProfileUpdatePassword(
	oldPassword: string,
	newPassword: string,
) {
	const res = await api.post("/user_profile/reset_password/", {
		password: newPassword,
		old_password: oldPassword,
	});
	return res.data;
}

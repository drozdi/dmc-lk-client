import { $setting } from "@/shared";
import { notification } from "@/shared/notification";
import { create } from "zustand";
import {
	requestUserProfileGet,
	requestUserProfileUpdate,
	requestUserProfileUpdatePassword,
} from "../api/user_profile";

import {
	requestPageSettingAdd,
	requestPageSettingDelete,
	requestPageSettingList,
	requestPageSettingUpdate,
} from "../api/page_setting.ts";

export const useStoreUserProfile = create<IStoreUserProfile>((set, get) => ({
	isLoading: false,
	error: "",
	userInfo: undefined,
	settings: [],
	production_id: Number($setting.get("production.id", 0)),

	setProductionId(production_id) {
		set({
			production_id,
		});
		$setting.set("production.id", String(production_id));
	},

	setUserInfo(userInfo: IUserInfo) {
		set((state) => ({
			userInfo: {
				...state.userInfo,
				...userInfo,
			},
		}));
	},
	async updateUserInfo(userData: IUserInfo) {
		set({
			isLoading: false,
			error: "",
		});
		try {
			const response = await requestUserProfileUpdate(userData);
			set((state) => ({
				isLoading: false,
				userInfo: {
					...state.userInfo,
					...response.data,
				},
			}));
			return true;
		} catch (e: IError) {
			console.error(e);
			const error =
				e.response?.data?.detail || e.message || "Ошибка обновления";
			notification.error(error);
			set({
				isLoading: false,
				error,
			});
		}
		return false;
	},
	async updateUserPassword(oldPassword: string, newPassword: string) {
		set({
			isLoading: true,
			error: "",
		});
		try {
			await requestUserProfileUpdatePassword(oldPassword, newPassword);
			set({
				isLoading: false,
			});
			return true;
		} catch (e: IError) {
			console.error(e);
			const error =
				e.response?.data?.detail || e.message || "Ошибка обновления";
			notification.alert(error);
			set({
				isLoading: false,
				error,
			});
		}
		return false;
	},

	async setSetting(setting_name, meaning) {
		const settings = get().settings;
		const index = settings.findIndex(
			(item) => item.setting_name === setting_name,
		);
		try {
			if (meaning && index === -1) {
				settings.push(
					(
						await requestPageSettingAdd({
							setting_name,
							meaning,
						})
					).data,
				);
			} else if (meaning) {
				await requestPageSettingUpdate(setting_name, {
					setting_name,
					meaning,
				});
			} else if (!meaning && index !== -1) {
				const setting = settings.splice(index, 1);
				await requestPageSettingDelete(setting[0].id);
			}
			set({
				settings: [...settings],
			});
		} catch (e: IError) {
			console.error(e);
			const error =
				e.response?.data?.detail || e.message || "Ошибка обновления";
			notification.alert(error);
			set({
				isLoading: false,
				error,
			});
		}
	},
	getSetting(setting_name) {
		return (
			get().settings.find((item) => item.setting_name === setting_name)
				?.meaning || undefined
		);
	},

	async updateSettings() {
		set({
			isLoading: true,
			error: "",
		});
		try {
			get().settings.forEach(async (item) => {
				await requestPageSettingUpdate(item.id, item);
			});
			set({
				isLoading: false,
			});
		} catch (e: IError) {
			console.error(e);
			const error =
				e.response?.data?.detail || e.message || "Ошибка обновления";
			notification.alert(error);
			set({
				isLoading: false,
				error,
			});
		}
	},

	async loadUserInfo(reloading = false) {
		let loaded = Boolean(get().userInfo);
		if (reloading) {
			loaded = false;
		}
		if (loaded) {
			return get().userInfo;
		}
		set({
			isLoading: true,
			error: "",
		});
		try {
			const userInfo = (await requestUserProfileGet()).data.user;
			set({
				isLoading: false,
				userInfo,
			});
			return userInfo;
		} catch (e: IError) {
			console.error(e);
			const error =
				e?.response?.data?.detail || e?.message || e || "Неизвестная ошибка";
			notification.alert(error);
			set({
				isLoading: false,
				error,
			});
		}

		return undefined;
	},
	async loadSettings(reloading = false) {
		let loaded = Boolean(get().settings.length);
		if (reloading) {
			loaded = false;
		}
		if (loaded) {
			return true;
		}
		set({
			isLoading: true,
			error: "",
		});
		try {
			let settings: ISetting[] = [];
			let res: ISetting[] = [];
			let size = 10;
			let number = 0;
			do {
				res = (
					await requestPageSettingList({
						size,
						number,
					})
				).data.response;
				settings = settings.concat(res);
			} while (res.length);
			set({
				isLoading: false,
				settings,
			});
			return true;
		} catch (e: IError) {
			console.error(e);
			const error =
				e?.response?.data?.detail || e?.message || e || "Неизвестная ошибка";
			notification.alert(error);
			set({
				isLoading: false,
				error,
			});
		}
		return false;
	},
	async load(reloading = false) {
		get().loadUserInfo(reloading);
		get().loadSettings(reloading);
	},

	reset() {
		set({
			userInfo: undefined,
			settings: [],
		});
	},
}));

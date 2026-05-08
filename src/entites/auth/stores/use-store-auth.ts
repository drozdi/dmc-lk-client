import { api } from "@/shared/api";
import { notification } from "@/shared/notification";
import { create } from "zustand";
import {
	requestRegistrationLogin,
	requestRegistrationRefresh,
	requestRegistrationRegister,
	requestRegistrationVerification,
} from "../api/registration";
import { useStoreUserProfile } from "./use-store-user-profile";

export const useStoreAuth = create<IStoreAuth>((set, get) => ({
		error: "",
		isLoading: true,
		isAuthenticated: false,
		clearAuth() {
			set({
				isAuthenticated: false,
				isLoading: false,
			});
			api.clearTokens();
		},
		async logout() {
			get().clearAuth();
		},
		async load() {
			const accessToken = api.getRefreshToken()
			const refreshToken = api.getAccessToken();
			if (!accessToken || !refreshToken) {
				get().clearAuth();
				return
			}
			set({
				isLoading: true,
			})
			try {
          const userInfo = await useStoreUserProfile.getState().loadUserInfo();
					if (userInfo) {
						set({ 
							isAuthenticated: true,
							isLoading: false 
						});
					} else {
						await get().logout();
					}
			} catch (error) {
				await get().logout();
				set({ 
							isAuthenticated: false,
							isLoading: false 
						});
			}
		},
		async login(email, password) {
			set({
				isLoading: true,
				error: "",
			});
			try {
				const response = await requestRegistrationLogin({
					email,
					password,
				});
				const { token } = response.data;
				api.setAccessToken(token.access);
				api.setRefreshToken(token.refresh);
				set({
					isAuthenticated: true,
					isLoading: false,
				});
				return true;
			} catch (e: IError) {
				console.error(e);
				const error = e.response?.data?.detail || e?.message || "Ошибка входа";
				notification.error(error);
				set({
					isAuthenticated: false,
					isLoading: false,
					error,
				});
			}
			return false;
		},
		async refreshAuth() {
			const refresh = api.getRefreshToken();

			if (!refresh) {
				throw new Error("Нет refresh token");
			}

			try {
				const response = await requestRegistrationRefresh(refresh);
				const { accessToken, refreshToken } = response;
				api.setAccessToken(accessToken);
				api.setRefreshToken(refreshToken);
				return { accessToken, refreshToken };
			} catch (error) {
				get().clearAuth();
				throw error;
			}
		},
		async verification(link) {
			set({
				isLoading: true,
				error: "",
			});
			try {
				const response = requestRegistrationVerification(link);
				let error = "";
				if (!response.data?.token) {
					error = "Токен не верен";
				}
				set({
					isLoading: false,
					error,
				});

				return response;
			} catch (e: IError) {
				const error = e.response?.data?.detail || e?.message || "Ошибка входа";
				set({
					isLoading: false,
					error,
				});
				notification.error(error);
			}
			return null;
		},
		
		async register(userData) {
			set({
				isLoading: true,
				error: "",
			});
			try {
				const response = await requestRegistrationRegister(userData);
				const { token, user } = response.data;
				api.setAccessToken(token.access);
				api.setRefreshToken(token.refresh);
				set({
					isAuthenticated: true,
					isLoading: false,
				});
				return response.data;
			} catch (e: IError) {
				console.error(e);
				const error =
					e.response?.data?.detail || e?.message || "Ошибка регистрации";
				notification.error(error);
				set({
					isLoading: false,
					error,
				});
			}
			return null;
		},
	}),
);

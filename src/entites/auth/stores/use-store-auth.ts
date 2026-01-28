import { api } from "@/shared/api";
import { notification } from "@/shared/notification";
import { getterZustandMiddleware } from "@/shared/stores";
import { create } from "zustand";
import {
	requestRegistrationLogin,
	requestRegistrationRefresh,
	requestRegistrationRegister,
	requestRegistrationVerification,
} from "../api/registration";

export const useStoreAuth = create<IStoreAuth>(
	getterZustandMiddleware((set, get) => ({
		error: "",
		isLoading: false,
		isAuthenticated: false,
		get isAuth() {
			return !!api.getRefreshToken() && !!api.getAccessToken();
		},
		clearAuth() {
			set({
				isAuthenticated: false,
			});
			api.clearTokens();
		},
		async load() {
			const isAuthenticated =
				!!api.getRefreshToken() && !!api.getAccessToken();
			set({
				isAuthenticated,
			});
			if (!isAuthenticated) {
				api.clearTokens();
			}
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
				set({
					isLoading: false,
				});
				return response;
			} catch (e: IError) {
				const error =
					e.response?.data?.detail || e?.message || "Ошибка входа";
				set({
					isLoading: false,
					error,
				});
				notification.error(error);
			}
			return null;
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
				const error =
					e.response?.data?.detail || e?.message || "Ошибка входа";
				notification.error(error);
				set({
					isLoading: false,
					error,
				});
			}
			return false;
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
					e.response?.data?.detail ||
					e?.message ||
					"Ошибка регистрации";
				notification.error(error);
				set({
					isLoading: false,
					error,
				});
			}
			return null;
		},
		async logout() {
			get().clearAuth();
		},
	})),
);

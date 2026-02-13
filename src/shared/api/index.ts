import { type Axios, type AxiosError } from "axios";
import { $setting } from "../setting";
import { AxiosInterceptor } from "../utils";

export const api = new AxiosInterceptor({
	baseURL: $setting.get("api.host") as string,
	headers: {
		"Content-Type": "application/json",
	},
	//message401: 'Signature has expired.',
	accessToken: "access",
	refreshToken: "refresh",
	accessTokenKey: "token.access",
	refreshTokenKey: "token.refresh",
	urlRefreshToken: async (refreshToken: string, axios: Axios) => {
		const res = await axios.post("/registration/refresh", {
			refresh_token: refreshToken,
		});
		return res.data.data.token;
	},
	message401: async (error: AxiosError, axios: Axios) => {
		return (
			error.response?.config?.url !== "/registration/refresh" &&
			error.response?.data?.detail === "Signature has expired."
		);
	},
	// handleRequest: config => {
	// 	if (config.data instanceof FormData) {
	// 		config.data.append('production_id', $setting.get('product.id'))
	// 	} else {
	// 		config.data = {
	// 			...config.data,
	// 			production_id: $setting.get('product.id'),
	// 		}
	// 	}
	// 	return {
	// 		...config,
	// 		params: {
	// 			...config.params,
	// 			production_id: $setting.get('product.id'),
	// 		},
	// 	}
	// },
});

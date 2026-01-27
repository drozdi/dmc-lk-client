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
	// urlRefreshToken: '/auth/refreshToken',
	urlRefreshToken: async (refreshToken: string, axios: Axios) => {
		const res = await axios.post("/registration/refresh", {
			refresh_token: refreshToken,
		});
		return res.data.data.token;
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

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../constants'
import { AxiosInterceptor, getURLApi } from '../utils'

export const api = new AxiosInterceptor({
	baseURL: getURLApi(),
	headers: {
		'Content-Type': 'application/json',
	},
	//message401: 'Signature has expired.',
	accessToken: 'access',
	refreshToken: 'refresh',
	accessTokenKey: ACCESS_TOKEN_KEY,
	refreshTokenKey: REFRESH_TOKEN_KEY,
	// urlRefreshToken: '/auth/refreshToken',
	urlRefreshToken: async (refreshToken: string, axios: Axios) => {
		const res = await axios.post('/registration/refresh', {
			refresh_token: refreshToken,
		})
		return res.data.data.token
	},
	// handleRequest: config => {
	// 	if (config.data instanceof FormData) {
	// 		config.data.append('production_id', localStorage.getItem(PRODUCT_ID_KEY))
	// 	} else {
	// 		config.data = {
	// 			...config.data,
	// 			production_id: localStorage.getItem(PRODUCT_ID_KEY),
	// 		}
	// 	}
	// 	return {
	// 		...config,
	// 		params: {
	// 			...config.params,
	// 			production_id: localStorage.getItem(PRODUCT_ID_KEY),
	// 		},
	// 	}
	// },
})

export async function requestLogin(credentials: { email: string; password: string }) {
	const res = await api.post('/registration/authorization', credentials)
	return res.data
}
export async function requestVerification(link: string) {
	const res = await api.get('/registration/verification', {
		params: { link },
	})
	return res.data
}
export async function requestRegister(userData: IUserPassword) {
	const res = await api.post('/registration/save_data', userData)
	return res.data
}
export async function requestRefresh(refreshToken: string) {
	const res = await api.post('/registration/refresh', {
		refresh_token: refreshToken,
	})
	return res.data
}

export async function requestGetUser() {
	const res = await api.get('/user_profile/')
	return res.data
}
export async function requestRemoveUser() {
	const res = await api.delete('/user_profile/')
	return res.data
}
export async function requestUpdateUser(userData: IUser) {
	const res = await api.patch('/user_profile/', userData)
	return res.data
}

export async function requestUpdatePassword(oldPassword: string, newPassword: string) {
	const res = await api.post('/user_profile/reset_password/', {
		password: newPassword,
		old_password: oldPassword,
	})
	return res.data
}

import axios, { AxiosError } from 'axios'
import { PRODUCT_ID_KEY } from '../constants'
import { getURLApi } from '../utils'
import { clearTokens, getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from './token-service'

export const api = axios.create({
	baseURL: getURLApi(),
	headers: {
		'Content-Type': 'application/json',
	},
})

api.interceptors.request.use(
	config => {
		const token = getAccessToken()
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
		// Площадка
		if (config.data instanceof FormData) {
			// Для FormData
			config.data.append('production_id', localStorage.getItem(PRODUCT_ID_KEY))
		} else {
			// Для JSON или других данных
			config.data = {
				...config.data,
				production_id: localStorage.getItem(PRODUCT_ID_KEY),
			}
		}
		return {
			...config,
			params: {
				...config.params,
				production_id: localStorage.getItem(PRODUCT_ID_KEY),
			},
		}
	},
	(error: AxiosError) => Promise.reject(error)
)
// Интерцептор для обработки 401 ошибки (не авторизован)
api.interceptors.response.use(
	response => response,
	async (error: AxiosError) => {
		const originalRequest = error.config

		if (originalRequest._retry) {
			return Promise.reject(error)
		}

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true
			try {
				const refreshToken = getRefreshToken()
				if (!refreshToken) {
					window.location.href = '/auth/sign-in'
				}
				// Пытаемся обновить токен
				const response = await requestRefresh(refreshToken)
				const { access, refresh } = response.data.token

				setAccessToken(access)
				setRefreshToken(refresh)

				originalRequest.headers.Authorization = `Bearer ${access}`
				return await api(originalRequest)
			} catch (refreshError) {
				// Если не удалось обновить - разлогиниваем
				clearTokens()
				//window.location.href = '/auth/sign-in'
				return Promise.reject(error)
			}
		}

		return Promise.reject(error)
	}
)

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

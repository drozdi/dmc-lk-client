import { axios, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../constants'

export const api = axios.create({
	baseURL: 'http://10.76.10.145:5055/v1/registration',
	headers: {
		'Content-Type': 'application/json',
	},
})

api.interceptors.request.use(
	(config: AxiosRequestConfig) => {
		const token = localStorage.getItem(ACCESS_TOKEN_KEY)
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	(error: AxiosError) => Promise.reject(error)
)

// Интерцептор для обработки 401 ошибки (не авторизован)
api.interceptors.response.use(
	(response: AxiosResponse) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config
		if (error.response?.status === 401) {
			try {
				// Пытаемся обновить токен
				const response = await api.post('/refresh', {
					refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
				})

				const { accessToken, refreshToken } = response.data

				localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
				localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)

				return api.request(originalRequest)
			} catch (refreshError) {
				// Если не удалось обновить - разлогиниваем
				localStorage.removeItem(ACCESS_TOKEN_KEY)
				localStorage.removeItem(REFRESH_TOKEN_KEY)

				return Promise.reject(error)
			}
		}

		return Promise.reject(error)
	}
)

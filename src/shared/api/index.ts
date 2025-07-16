import axios, { AxiosError } from 'axios'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, URL_API } from '../constants'

export const api = axios.create({
	baseURL: URL_API,
	headers: {
		'Content-Type': 'application/json',
	},
})

api.interceptors.request.use(
	config => {
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
	response => response,
	async (error: AxiosError) => {
		const originalRequest = error.config
		if (error.response?.status === 401) {
			try {
				// Пытаемся обновить токен
				const response = await api.post('/registration/refresh', {
					refresh_token: localStorage.getItem(REFRESH_TOKEN_KEY),
				})

				const { access, refresh } = response.data.token

				localStorage.setItem(ACCESS_TOKEN_KEY, access)
				localStorage.setItem(REFRESH_TOKEN_KEY, refresh)

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

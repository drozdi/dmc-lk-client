import axios, { AxiosError } from 'axios'
import { makeAutoObservable } from 'mobx'
import { api } from '../api'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, URL_API } from '../constants'

class AuthStore {
	accessToken = localStorage.getItem(ACCESS_TOKEN_KEY) || null
	refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) || null
	user = null
	error = null
	isLoading = false
	axiosInstance

	get isAuthenticated() {
		return !!this.accessToken && !!this.refreshToken
	}
	get interceptors() {
		return this.axiosInstance
	}
	constructor() {
		makeAutoObservable(this)
		this.isAuthenticated = !!this.accessToken && !!this.refreshToken
		this.axiosInstance = axios.create({
			baseURL: URL_API,
			headers: {
				'Content-Type': 'application/json',
			},
		})

		this.initInterceptors()
		this.initializeAuth()
	}
	private initInterceptors() {
		// Request interceptor для добавления access token
		this.axiosInstance.interceptors.request.use(
			config => {
				if (this.accessToken && !config.headers.Authorization) {
					config.headers.Authorization = `Bearer ${this.accessToken}`
				}
				return config
			},
			error => Promise.reject(error)
		)
		// Response interceptor для обработки 401 ошибки и refresh token
		this.axiosInstance.interceptors.response.use(
			response => response,
			async (error: AxiosError) => {
				const originalRequest = error.config

				// Если ошибка 401 и это не запрос на обновление токена
				if (
					error.response?.status === 401 &&
					!originalRequest.url?.includes('/registration/refresh')
				) {
					try {
						// Пытаемся обновить токен
						const { accessToken } = await this.refreshAuth()

						// Повторяем оригинальный запрос с новым токеном
						if (originalRequest.headers) {
							originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
						}
						return this.axiosInstance(originalRequest)
					} catch (refreshError) {
						// Если не удалось обновить - разлогиниваем
						this.logout()
						return Promise.reject(error)
					}
				}

				return Promise.reject(error)
			}
		)
	}
	private async initializeAuth() {}
	private setAccessToken(accessToken: string) {
		this.accessToken = accessToken
		localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
	}
	private setRefreshToken(refreshToken: string) {
		this.refreshToken = refreshToken
		localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
	}
	private clearAuth() {
		this.accessToken = null
		this.refreshToken = null
		this.user = null
		localStorage.removeItem(ACCESS_TOKEN_KEY)
		localStorage.removeItem(REFRESH_TOKEN_KEY)
	}
	private async refreshAuth() {
		if (!this.refreshToken) {
			throw new Error('Нет refresh token')
		}

		try {
			const response = await api.post('/registration/refresh', {
				refresh_token: this.refreshToken,
			})
			const { accessToken, refreshToken } = response.data
			this.setAccessToken(accessToken)
			this.setRefreshToken(refreshToken)
			return { accessToken, refreshToken }
		} catch (error) {
			this.clearAuth()
			throw error
		}
	}
	async login(email: string, password: string) {
		this.isLoading = true
		this.error = null
		try {
			const response = await api.post('/authorization', { email, password })
			this.setAccessToken(response.data.accessToken)
			this.setRefreshToken(response.data.refreshToken)
			return true
		} catch (error) {
			this.error = error.response?.data?.message || 'Ошибка входа'
		} finally {
			this.isLoading = false
		}
		return false
	}
	async register(userData) {
		this.isLoading = true
		this.error = null
		try {
			const response = await api.post('/save_data', userData)
			this.setAccessToken(response.data.accessToken)
			this.setRefreshToken(response.data.refreshToken)
			return true
		} catch (error) {
			this.error = error.response?.data?.message || 'Ошибка регистрации'
		} finally {
			this.isLoading = false
		}
		return false
	}
	async logout() {
		this.clearAuth()
	}
}

export const authStore = new AuthStore()

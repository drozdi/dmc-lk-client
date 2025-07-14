import { makeAutoObservable } from 'mobx'
import { api } from '../api'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../constants'

class AuthStore {
	accessToken = localStorage.getItem(ACCESS_TOKEN_KEY) || null
	refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) || null
	user = null
	error = null
	isLoading = false

	get isAuthenticated() {
		return !!this.accessToken && !!this.refreshToken
	}
	constructor() {
		makeAutoObservable(this)
		this.initializeAuth()
	}
	private async initializeAuth() {
		this.isLoading = true
		this.error = null
		try {
			if (this.isAuthenticated) {
				const response = await api.get('/user_profile/')
				this.user = response.data.data.user
			}
		} catch (error) {
			this.error = error.response?.data?.detail || 'Ошибка проверки'
		} finally {
			this.isLoading = false
		}
	}
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
	async verification(link: string) {
		this.isLoading = true
		this.error = null
		try {
			const response = await api.get('/registration/verification', {
				params: { link },
			})
			return response.data
		} catch (error) {
			this.error = error.response?.data?.detail || 'Ошибка входа'
		} finally {
			this.isLoading = false
		}
		return null
	}
	async login(email: string, password: string) {
		this.isLoading = true
		this.error = null
		try {
			const response = await api.post('/registration/authorization', {
				email,
				password,
			})
			const { token } = response.data.data
			this.setAccessToken(token.access)
			this.setRefreshToken(token.refresh)
			return true
		} catch (error) {
			console.log(error)
			this.error = error.response?.data?.detail || 'Ошибка входа'
		} finally {
			this.isLoading = false
		}
		return false
	}
	async register(userData: {}) {
		this.isLoading = true
		this.error = null
		try {
			const response = await api.post('/registration/save_data', userData)
			const { user, token } = response.data.data
			this.user = user
			this.setAccessToken(token.access)
			this.setRefreshToken(token.refresh)
			return response.data
		} catch (error) {
			this.error = error.response?.data?.detail || 'Ошибка регистрации'
		} finally {
			this.isLoading = false
		}
		return null
	}
	async logout() {
		this.clearAuth()
	}
	async updateUser(userData: {}) {
		this.isLoading = true
		this.error = null
		try {
			const response = await api.patch('/user_profile/', userData)
			this.user = response.data.data
			return response.data
		} catch (error) {
			this.error = error.response?.data?.detail || 'Ошибка регистрации'
		} finally {
			this.isLoading = false
		}
		return null
	}
}

export const authStore = new AuthStore()

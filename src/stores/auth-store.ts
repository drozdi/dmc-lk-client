import { makeAutoObservable } from 'mobx'
import { api, requestLogin, requestRefresh, requestRegister, requestVerification } from '../shared/api'
import { notification } from '../shared/notification'

class AuthStore {
	error = null
	isLoading = false
	isAuthenticated = false

	constructor() {
		makeAutoObservable(this)
		this.checkAuth()
	}
	checkAuth = () => {
		this.isAuthenticated = !!api.getRefreshToken() && !!api.getAccessToken()
	}
	private clearAuth() {
		this.isAuthenticated = false
		api.clearTokens()
	}
	private async refreshAuth() {
		const refresh = api.getRefreshToken()

		if (!refresh) {
			throw new Error('Нет refresh token')
		}

		try {
			const response = await requestRefresh(refresh)
			const { accessToken, refreshToken } = response
			api.setAccessToken(accessToken)
			api.setRefreshToken(refreshToken)
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
			const response = requestVerification(link)
			return response
		} catch (error) {
			this.error = error.response?.data?.detail || error?.message || 'Ошибка входа'
		} finally {
			this.isLoading = false
		}
		return null
	}
	async login(email: string, password: string) {
		this.isLoading = true
		this.error = null
		try {
			const response = await requestLogin({
				email,
				password,
			})
			const { token } = response.data
			api.setAccessToken(token.access)
			api.setRefreshToken(token.refresh)
			this.isAuthenticated = true
			return true
		} catch (error) {
			console.error(error)
			this.error = error?.response?.data?.detail || error?.message || 'Ошибка входа'
			notification.error(this.error)
		} finally {
			this.isLoading = false
		}
		return false
	}
	async register(userData: IUserPassword) {
		this.isLoading = true
		this.error = null
		try {
			const response = await requestRegister(userData)
			const { token, user } = response.data
			api.setAccessToken(token.access)
			api.setRefreshToken(token.refresh)
			this.isAuthenticated = true
			return response.data
		} catch (error) {
			this.error = error?.response?.data?.detail || error?.message || 'Ошибка регистрации'
		} finally {
			this.isLoading = false
		}
		return null
	}
	async logout() {
		this.clearAuth()
	}
}

export const authStore = new AuthStore()

import { makeAutoObservable, runInAction } from 'mobx'
import { requestUsersProducts } from '../apps/users/api'
import { requestGetUser, requestRemoveUser, requestUpdatePassword, requestUpdateUser } from '../shared/api'
import { PRODUCT_ID_KEY } from '../shared/constants'
import { notification } from '../shared/notification'

class UserStore {
	userData: IUser
	isLoading = false
	error: string | null = null
	products: any[] = []
	currentProductId: string | null = localStorage.getItem(PRODUCT_ID_KEY) || null
	constructor() {
		makeAutoObservable(this)
	}
	setCurrentProductId(id: string) {
		if (this.currentProductId !== id) {
			this.currentProductId = id
			localStorage.setItem(PRODUCT_ID_KEY, id)
		}
	}
	setUserData(data: IUser) {
		runInAction(() => {
			this.userData = { ...this.userData, ...data }
		})
	}

	async fetch() {
		try {
			const response = await requestGetUser()
			this.userData = response.data.user
			const products = await requestUsersProducts()
			this.products = products.data
			if (!this.currentProductId) {
				this.setCurrentProductId(this.products[0].production_id)
			}
		} catch (error) {
			this.error = error.response?.data?.detail || error.message || 'Ошибка загрузки'
		} finally {
			this.isLoading = false
		}
	}
	async update(userData: IUser) {
		this.isLoading = true
		this.error = null
		try {
			const response = await requestUpdateUser(userData)
			this.userData = response.data
		} catch (error) {
			this.error = error.response?.data?.detail || error.message || 'Ошибка обновления'
			notification.error(this.error)
		} finally {
			this.isLoading = false
		}
		return null
	}
	async updatePassword(oldPassword: string, newPassword: string) {
		this.isLoading = true
		this.error = null
		try {
			const response = await requestUpdatePassword(oldPassword, newPassword)
			this.userData = response.data
			return true
		} catch (error) {
			this.error = error.response?.data?.detail || error.message || 'Ошибка обновления'
			notification.error(this.error)
		} finally {
			this.isLoading = false
		}
		return null
	}
	async remove() {
		this.isLoading = true
		this.error = null
		try {
			const response = await requestRemoveUser()
		} catch (error) {
			this.error = error.response?.data?.detail || error.message || 'Ошибка удаления'
			notification.error(this.error)
		} finally {
			this.isLoading = false
		}
		return null
	}
	reset() {
		this.userData = null
		this.products = []
	}
}

export const userStore = new UserStore()

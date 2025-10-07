import { makeAutoObservable } from 'mobx'

import { requestGetUser, requestRemoveUser, requestUpdateUser } from '../shared/api'

import { requestGetProducts } from '../apps/users/api'

import { PRODUCT_ID_KEY } from '../shared/constants'

class UserStore {
	user: IUser | null = null
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
	async fetch() {
		try {
			const response = await requestGetUser()
			this.user = response.data.user
			const products = await requestGetProducts()
			this.products = products.data
			if (!this.currentProductId) {
				this.setCurrentProductId(this.products[0].production_id)
			}
		} catch (error) {
			this.error = error?.response?.data?.detail || error?.message || 'Ошибка загрузки'
		} finally {
			this.isLoading = false
		}
	}
	async update(userData: IUser) {
		this.isLoading = true
		this.error = null
		try {
			const response = await requestUpdateUser(userData)
			this.user = response.data
		} catch (error) {
			this.error = error?.response?.data?.detail || error?.message || 'Ошибка регистрации'
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
			this.error = error?.response?.data?.detail || error?.message || 'Ошибка удаления'
		} finally {
			this.isLoading = false
		}
		return null
	}
	reset() {
		this.user = null
		this.products = []
	}
}

export const userStore = new UserStore()

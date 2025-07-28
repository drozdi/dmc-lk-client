import { makeAutoObservable } from 'mobx'
import { requestGetProducts } from '../api'
class UsersStores {
	isLoading: boolean = false
	error?: string = undefined
	products: Array<{
		production_id: number
		name_production: string
	}> = []
	constructor() {
		makeAutoObservable(this)
		this.load()
	}
	async load() {
		this.isLoading = true
		this.error = undefined
		try {
			const res = await requestGetProducts()
			this.products = res.data
		} catch (error) {
			this.error =
				error?.response?.data?.detail || error?.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}
}

export const usersStores = new UsersStores()

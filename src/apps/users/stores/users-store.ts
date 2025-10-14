import { makeAutoObservable } from 'mobx'
import { requestUsersProducts } from '../api'
class UsersStores implements IQuery, Record<string, any> {
	isLoading: boolean = false
	isLoaded: boolean = false
	error?: string = undefined
	_products: Array<{
		production_id: number
		name_production: string
	}> = []
	constructor() {
		makeAutoObservable(this)
	}
	get products() {
		this.load()
		return this._products
	}
	async load(reloading: boolean = false) {
		if (reloading) {
			this.isLoaded = false
			this._products = []
		}
		if (this.isLoaded) {
			return
		}
		this.isLoading = true
		this.error = undefined
		try {
			const res = await requestUsersProducts()
			this._products = res.data
			this.isLoaded = true
		} catch (error) {
			this.error = error?.response?.data?.detail || error?.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}
}

export const usersStore = new UsersStores()

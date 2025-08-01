import { makeAutoObservable } from 'mobx'
import { requestAnalyticsFields } from '../api/fields'

class FieldsStore {
	_fields: Record<string, any> = {}
	isLoading = false
	isLoaded = false
	error?: string = undefined
	get list() {
		return Object.keys(this._fields)
	}
	get fields() {
		this.load()
		return this._fields
	}
	constructor() {
		makeAutoObservable(this)
	}
	async load(reloading: boolean = false) {
		if (reloading) {
			this.isLoaded = false
			this._fields = {}
		}
		if (this.isLoaded) {
			return
		}
		this.isLoading = true
		this.error = ''
		try {
			const res = await requestAnalyticsFields()
			this._fields = res.data.message
			this.isLoaded = true
		} catch (error) {
			this.error =
				error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}
}

export const fieldsStore = new FieldsStore()

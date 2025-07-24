import { makeAutoObservable } from 'mobx'
import { requestAnalyticsFields } from '../api/fields'

const ANALYTICS_KEY = 'analytics.form'

class FieldsStore {
	fields: Record<string, any> = {}
	isLoading = false
	error = undefined
	get list() {
		return Object.keys(this.fields)
	}
	constructor() {
		makeAutoObservable(this)
		this.load()
	}
	async load() {
		this.isLoading = true
		try {
			const res = await requestAnalyticsFields()
			this.fields = res.data.message
		} catch (error) {
			this.error =
				error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}
}

export const fieldsStore = new FieldsStore()

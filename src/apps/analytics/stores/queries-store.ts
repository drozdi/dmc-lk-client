import { makeAutoObservable } from 'mobx'
import { requestFields } from '../api/fields'

class QueriesStore {
	fields: Record<string, any> = {}
	isLoading = false
	error = undefined
	isLoaded = false
	get list() {
		return Object.keys(this.fields)
	}
	constructor() {
		makeAutoObservable(this)
		this.load()
	}
	async load() {
		if (this.isLoaded) {
			return
		}
		this.isLoading = true
		try {
			const res = await requestFields()
			this.fields = res.data.message
			this.isLoaded = true
		} catch (error) {
			this.error = error.message
		} finally {
			this.isLoading = false
		}
	}
}

export const queriesStore = new QueriesStore()

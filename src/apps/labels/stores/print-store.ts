import { makeAutoObservable } from 'mobx'
import { requestLabelsAllPrint } from '../api'

class PrintStore {
	prints: string[] = []
	isLoading = false
	error?: string = undefined
	constructor() {
		makeAutoObservable(this)
		this.load()
	}
	async load() {
		this.error = undefined
		this.isLoading = true
		try {
			const res = await requestLabelsAllPrint()
			this.prints = res.data
		} catch (error) {
			this.error =
				error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}
}

export const printStore = new PrintStore()

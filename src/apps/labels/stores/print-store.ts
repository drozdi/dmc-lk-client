import { makeAutoObservable } from 'mobx'
import { requestLabelsAllPrint } from '../api'

class PrintStore {
	_prints: string[] = []
	isLoading = false
	isLoaded = false
	error?: string = undefined
	constructor() {
		makeAutoObservable(this)
		this.load()
	}
	get prints() {
		this.load()
		return this._prints
	}
	async load(reloading: boolean = false) {
		if (reloading) {
			this.isLoaded = false
			this._prints = []
		}
		if (this.isLoaded) {
			return
		}
		this.error = undefined
		this.isLoading = true
		try {
			const res = await requestLabelsAllPrint()
			this._prints = res.data
		} catch (error) {
			this.error =
				error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}
}

export const printStore = new PrintStore()

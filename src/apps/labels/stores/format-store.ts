import { makeAutoObservable } from 'mobx'
import { requestLabelsAddFormat, requestLabelsAllFormat } from '../api'

class FormatStore {
	formats: string[] = []
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
			const res = await requestLabelsAllFormat()
			this.formats = res.data
		} catch (error) {
			this.error =
				error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}
	async add(format: string) {
		if (!format.trim()) {
			this.error = 'Название не может быть пустым'
			return
		}
		this.error = undefined
		this.isLoading = true
		try {
			await requestLabelsAddFormat(format)
			this.formats.push(format)
		} catch (error) {
			this.error =
				error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}
}

export const formatStore = new FormatStore()

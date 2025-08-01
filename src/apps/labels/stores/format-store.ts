import { makeAutoObservable } from 'mobx'
import { requestLabelsAddFormat, requestLabelsAllFormat } from '../api'

class FormatStore {
	_formats: Record<string, string[]> = {}
	isLoading = false
	isLoaded = false
	error?: string = undefined
	constructor() {
		makeAutoObservable(this)
	}
	get formats() {
		this.load()
		return this._formats
	}
	async load(reloading: boolean = false) {
		if (reloading) {
			this.isLoaded = false
			this._formats = []
		}
		if (this.isLoaded) {
			return
		}

		this.error = undefined
		this.isLoading = true
		try {
			const res = await requestLabelsAllFormat()
			this.isLoaded = true
			this._formats = res.data
		} catch (error) {
			this.error =
				error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}
	async add({
		format,
		production_id,
	}: {
		format: string
		production_id: number
	}) {
		if (!format.trim()) {
			this.error = 'Название не может быть пустым'
			return
		}
		this.error = undefined
		this.isLoading = true
		try {
			await requestLabelsAddFormat({ format, production_id })
			this._formats[production_id] = [
				...(this._formats[production_id] || []),
				format,
			]
			this.load(true)
		} catch (error) {
			this.error =
				error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}
}

export const formatStore = new FormatStore()

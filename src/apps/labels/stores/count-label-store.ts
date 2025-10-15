import { makeAutoObservable } from 'mobx'
import { requestLabelsCount, requestLabelsCountAdd, requestLabelsCountHistory, requestLabelsCountReset } from '../api'

class CountLabelStore implements IQuery, Record<string, any> {
	isLoading = false
	error?: string = undefined

	isLoadedHistory = false
	private _history: IResponseCountLabelHistory = {}
	get history(): IResponseCountLabelHistory {
		this.loadHistory()
		return this._history
	}
	async loadHistory(reloading: boolean = false) {
		if (reloading) {
			this.isLoadedHistory = false
			this._history = {}
		}
		if (this.isLoadedHistory) {
			return
		}

		this.error = undefined
		this.isLoading = true
		try {
			const res = await requestLabelsCountHistory()
			this.isLoadedHistory = true
			this._history = res.data.response
		} catch (error) {
			this.error = error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}

	isLoadedCount = false
	private _count: IResponseCountLabel = {
		distributed: [],
		not_distributed: [],
	}
	get count(): IResponseCountLabel {
		this.loadCount()
		return this._count
	}
	async loadCount(reloading: boolean = false) {
		if (reloading) {
			this.isLoadedCount = false
			this._count = {}
		}
		if (this.isLoadedCount) {
			return
		}

		this.error = undefined
		this.isLoading = true
		try {
			const res = await requestLabelsCount()
			this.isLoadedCount = true
			this._count = res.data
		} catch (error) {
			this.error = error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}

	constructor() {
		makeAutoObservable(this)
	}

	async load(reloading: boolean = false) {
		await this.loadHistory(reloading)
		await this.loadCount(reloading)
	}

	async reset(production_id: IRequestCountLabelReset) {
		this.error = undefined
		this.isLoading = true
		try {
			await requestLabelsCountReset(production_id)
		} catch (error) {
			this.error = error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}
	async add(param: IRequestCountLabelAdd) {
		this.error = undefined
		this.isLoading = true
		try {
			return await requestLabelsCountAdd(param)
		} catch (error) {
			this.error = error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}
}

export const countLabelStore = new CountLabelStore()

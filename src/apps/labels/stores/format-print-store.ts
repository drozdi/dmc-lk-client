import { makeAutoObservable } from 'mobx'
import {
	requestLabelsDetachFormat,
	requestLabelsJoinFormat,
	requestLabelsList,
	requestLabelsUpdateJoined,
} from '../api'

class FormatPrintStore {
	private _formatPrints: Array<{
		id: string
		format: string
		print: string
	}> = []
	isLoading = false
	isLoaded = false
	error?: string = undefined

	constructor() {
		makeAutoObservable(this)
	}
	get formatPrints() {
		this.load()
		return this._formatPrints
	}
	async load(reloading: boolean = false) {
		if (reloading) {
			this.isLoaded = false
			this._formatPrints = []
		}
		if (this.isLoaded) {
			return
		}

		this.error = undefined
		this.isLoading = true
		try {
			const res = await requestLabelsList({
				size: 100,
				number: 0,
			})
			this.isLoaded = true
			this._formatPrints = Object.fromEntries(
				Object.keys(res.response).map(key => {
					return [
						key,
						res.response[key]
							.map(item => ({
								...item,
								format: item.add_label_format,
								print: item.statistics_print_format,
							}))
							.filter(item => item.format !== item.print),
					]
				})
			)
		} catch (error) {
			this.error =
				error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}
	async add(data: Record<string, string>) {
		this.error = undefined
		this.isLoading = true
		try {
			const res = await requestLabelsJoinFormat(data)
			await this.load(true)
		} catch (error) {
			this.error =
				error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}
	async delete(id: number) {
		this.error = undefined
		this.isLoading = true
		try {
			const res = await requestLabelsDetachFormat(id)
			await this.load(true)
		} catch (error) {
			this.error =
				error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}
	async update(id: number, data: Record<string, string>) {
		this.error = undefined
		this.isLoading = true
		try {
			const res = await requestLabelsUpdateJoined(id, {
				...this._formatPrints[data.production_id].find(item => item.id === id),
				...data,
			})
			await this.load(true)
		} catch (error) {
			this.error =
				error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}
}

export const formatPrintStore = new FormatPrintStore()

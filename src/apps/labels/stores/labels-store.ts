import { makeAutoObservable } from 'mobx'
import {
	requestLabelsAddFormat,
	requestLabelsAllFormat,
	requestLabelsAllPrint,
	requestLabelsDetachFormat,
	requestLabelsJoinFormat,
	requestLabelsList,
	requestLabelsUpdateJoined,
} from '../api'

class LabelsStore implements IQuery, Record<string, any> {
	isLoading = false
	error?: string = undefined

	constructor() {
		makeAutoObservable(this)
	}

	async load(reloading: boolean = false) {
		await this.loadPrints(reloading)
		await this.loadFormats(reloading)
		await this.loadFormatPrints(reloading)
	}

	private _prints: Record<string, string[]> = {}
	isLoadedPrint = false
	get prints(): Record<string, string[]> {
		this.loadPrints()
		return this._prints
	}
	async loadPrints(reloading: boolean = false) {
		if (reloading) {
			this.isLoadedPrint = false
			this._prints = {}
		}
		if (this.isLoadedPrint) {
			return
		}
		this.error = undefined
		this.isLoading = true
		try {
			const res = await requestLabelsAllPrint()
			this.isLoadedPrint = true
			this._prints = res.data
		} catch (error) {
			this.error = error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}

	private _formats: Record<string, string[]> = {}
	isLoadedFormats = false
	get formats(): Record<string, string[]> {
		this.loadFormats()
		return this._formats
	}
	async loadFormats(reloading: boolean = false) {
		if (reloading) {
			this.isLoadedFormats = false
			this._formats = {}
		}
		if (this.isLoadedFormats) {
			return
		}

		this.error = undefined
		this.isLoading = true
		try {
			const res = await requestLabelsAllFormat()
			this.isLoadedFormats = true
			this._formats = res.data
		} catch (error) {
			this.error = error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}
	async addFormat({ format, production_id }: { format: string; production_id: number }) {
		if (!format.trim()) {
			this.error = 'Название не может быть пустым'
			return
		}
		this.error = undefined
		this.isLoading = true
		try {
			await requestLabelsAddFormat({ format, production_id })
			this._formats[production_id] = [...(this._formats[production_id] || []), format]
			this.loadFormats(true)
		} catch (error) {
			this.error = error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}

	private _formatPrints: Array<{
		id: number
		format: string
		print: string
	}> = []
	isLoadedFormatPrints = false
	get formatPrints(): Array<{
		id: number
		format: string
		print: string
	}> {
		this.loadFormatPrints()
		return this._formatPrints
	}
	async loadFormatPrints(reloading: boolean = false) {
		if (reloading) {
			this.isLoadedFormatPrints = false
			this._formatPrints = []
		}
		if (this.isLoadedFormatPrints) {
			return
		}

		this.error = undefined
		this.isLoading = true
		try {
			const res = await requestLabelsList({
				size: 100,
				number: 0,
			})
			this.isLoadedFormatPrints = true
			this._formatPrints = Object.fromEntries(
				Object.keys(res.data.response).map(key => {
					return [
						key,
						res.data.response[key]
							?.map(item => ({
								...item,
								format: item.add_label_format,
								print: item.statistics_print_format,
							}))
							.filter(item => item.format !== item.print),
					]
				})
			)
		} catch (error) {
			this.error = error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}
	async addFormatPrint(data: Record<string, string>) {
		this.error = undefined
		this.isLoading = true
		try {
			const res = await requestLabelsJoinFormat(data)
			await this.loadFormatPrints(true)
		} catch (error) {
			this.error = error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}
	async deleteFormatPrint(id: number) {
		this.error = undefined
		this.isLoading = true
		try {
			const res = await requestLabelsDetachFormat(id)
			await this.loadFormatPrints(true)
		} catch (error) {
			this.error = error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}
	async updateFormatPrint(id: number, data: Record<string, string>) {
		this.error = undefined
		this.isLoading = true
		try {
			const res = await requestLabelsUpdateJoined(id, {
				...this._formatPrints[data.production_id].find(item => item.id === id),
				...data,
			})
			await this.loadFormatPrints(true)
		} catch (error) {
			this.error = error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}
}

export const labelsStore = new LabelsStore()

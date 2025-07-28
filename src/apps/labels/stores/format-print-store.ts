import { makeAutoObservable } from 'mobx'
import { requestLabelsList, requestLabelsUpdateJoined } from '../api'

class FormatPrintStore {
	formatPrints: Array<{
		id: string
		format: string
		print: string
	}> = []
	isLoading = false
	error?: string = undefined
	constructor() {
		makeAutoObservable(this)
		//this.load()
	}
	async load() {
		this.error = undefined
		this.isLoading = true
		try {
			let number = 0
			let res = {
				response: [],
			}
			let newList: Array<{ id: string; format: string; print: string }> = []
			do {
				let res = await requestLabelsList({
					size: 100,
					number,
				})
				newList = newList.concat(
					res.response
						.map(item => ({
							id: item.id,
							format: item.add_label_format,
							print: item.statistics_print_format,
						}))
						.filter(item => item.format !== 'C14')
				)
				number++
			} while (res.response.length === 100)
			console.log('format-print', newList)
			this.formatPrints = newList
		} catch (error) {
			this.error =
				error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}
	async add() {}
	async update(
		id: number,
		data: {
			format: string
			print: string
		}
	) {
		this.error = undefined
		this.isLoading = true
		try {
			const res = await requestLabelsUpdateJoined(id, data)
			this.formatPrints = this.formatPrints.map(item =>
				id === item.id ? {} : item
			)
		} catch (error) {
			this.error =
				error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}
}

export const formatPrintStore = new FormatPrintStore()

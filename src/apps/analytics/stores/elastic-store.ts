import { makeAutoObservable } from 'mobx'
import { requestElastic } from '../api/elastic'
import { requestFields } from '../api/fields'

const ANALYTICS_KEY = 'analytics.form'
class ElasticStore {
	fields: Record<string, any> = {}
	isLoading = false
	error = undefined
	isLoaded = false
	template: any[] = []
	date: {
		date_from: string
		date_to: string
	} = {
		date_from: '2024-05-23',
		date_to: '2024-07-23',
	}
	data = []
	history = []
	nextPage = ''
	limit = 50
	get list() {
		return Object.keys(this.fields)
	}
	get isNext() {
		return !!this.nextPage
	}
	get isPrev() {
		return this.history.length > 1
	}
	constructor() {
		makeAutoObservable(this)
		this.load()
		const data = localStorage.getItem(ANALYTICS_KEY)
		if (data) {
			this.template = JSON.parse(data)
		}
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

	saveTemp(data: any[]) {
		this.template = data
		localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data))
	}
	setDate(date: {}) {
		this.date = { ...this.date, ...date }
	}
	async send(page = '', histrory = true) {
		this.isLoading = true
		try {
			const select_field = []
			const list_where = []
			const date_limit = {}

			this.template.forEach(item => {
				select_field.push(item.accessorKey)
				if (Array.isArray(item.value)) {
					item.value.length > 0 &&
						list_where.push({
							name_field_table: item.accessorKey,
							search_value: item.value,
							sing_action: item.sign || '=',
							single_action_list: item.action || 'and',
						})
				} else if (item.value) {
					list_where.push({
						name_field_table: item.accessorKey,
						search_value: item.value,
						sing_action: item.sign || '=',
						single_action_list: item.action || 'and',
					})
				}
			})
			delete list_where[list_where.length - 1]?.single_action_list

			date_limit.date_from = this.date.date_from
			date_limit.date_to = this.date.date_to

			const res = await requestElastic({
				company: {
					select_field,
					list_where,
					date_limit,
				},
				paginate: {
					id_record: page,
					limit_page: this.limit,
				},
			})
			histrory && this.history.push(page)
			this.nextPage = res.data.last_id_record
			this.data = res.data.message
			return res.data
		} catch (error) {
			this.error = error.message
		} finally {
			this.isLoading = false
		}
	}
	async next() {
		await this.send(this.nextPage)
	}
	async prev() {
		if (this.history.length > 1) {
			this.history.pop()
			await this.send(this.history[this.history.length - 1], false)
		}
	}
	async reset() {
		if (this.history.length) {
			this.history = []
			await this.send('', false)
		}
	}
	async setLimit(limit: number) {
		if (limit !== this.limit) {
			this.limit = limit
			this.history = []
			await this.send('', false)
		}
	}
}

export const elasticStore = new ElasticStore()

import { makeAutoObservable } from 'mobx'
import { requestAnalyticsElastic } from '../api/elastic'
import {
	requestAnalyticsAddQuery,
	requestAnalyticsUpdateQuery,
} from '../api/queries'

const ANALYTICS_ELASTIC_KEY = 'analytics.elastic.form'
class ElasticStore {
	isLoading = false
	error = undefined

	template: IAnalyticsElasticQuery = {
		company: {
			select_field: [],
			list_where: [],
			date_limit: {
				date_from: '2024-05-23',
				date_to: '2024-07-23',
				date_rounding: undefined,
			},
		},
		paginate: {
			id_record: undefined,
			limit_page: 50,
		},
	}

	data = []
	history = []
	id = 0
	name = ''
	setId(id: number) {
		this.id = id
	}
	setName(name: string) {
		this.name = name
	}

	get nextPage() {
		return this.template.paginate.id_record
	}
	set nextPage(value) {
		this.template = {
			...this.template,
			paginate: {
				...this.template.paginate,
				id_record: value,
			},
		}
	}
	get limit() {
		try {
			return this.template.paginate.limit_page
		} catch (error) {
			return 50
		}
	}
	set limit(value) {
		this.template = {
			...this.template,
			paginate: {
				...this.template.paginate,
				limit_page: value,
			},
		}
	}
	get isNext() {
		return !!this.template.paginate.id_record
	}
	get isPrev() {
		return this.history.length > 1
	}
	get date() {
		return this.template.company.date_limit
	}

	constructor() {
		makeAutoObservable(this)
		const data = localStorage.getItem(ANALYTICS_ELASTIC_KEY)
		if (data) {
			this.template = JSON.parse(data)
		}
	}

	saveTemp(data: IAnalyticsElasticQuery) {
		this.template = data
		localStorage.setItem(ANALYTICS_ELASTIC_KEY, JSON.stringify(data))
	}
	setDate(date: {}) {
		this.template.company.date_limit = {
			...this.template.company.date_limit,
			...date,
		}
	}
	async send(page = '', histrory = true) {
		this.isLoading = true
		try {
			const select_field = [...this.template.company.select_field]
			const list_where = this.template.company.list_where?.filter(item => {
				if (Array.isArray(item.search_value)) {
					if (item.search_value.length > 0) {
						return item
					}
				} else if (item.search_value) {
					return item
				}
			})
			const date_limit = { ...this.template.company.date_limit }

			if (list_where.length > 0) {
				delete list_where[list_where.length - 1]?.single_action_list
			}

			const res = await requestAnalyticsElastic({
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
			this.error =
				error.response?.data?.detail || error.message || 'Неизвестная ошибка'
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
		this.history = []
		await this.send('', true)
	}
	async setLimit(limit: number) {
		if (limit !== this.limit) {
			this.limit = limit
			this.history = []
			await this.send('', false)
		}
	}
	async save() {
		this.isLoading = true
		try {
			let res
			if (this.id) {
				res = await requestAnalyticsUpdateQuery(
					this.id,
					this.name,
					this.template
				)
			} else {
				res = await requestAnalyticsAddQuery(this.name, this.template)
			}
		} catch (error) {
			this.error =
				error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}
	async clear() {
		this.template = {
			company: {
				select_field: [],
				list_where: [],
				date_limit: {
					date_from: '',
					date_to: '',
					date_rounding: undefined,
				},
			},
			paginate: {
				id_record: undefined,
				limit_page: 50,
			},
		}
		this.id = 0
		this.name = ''
	}
}

export const elasticStore = new ElasticStore()

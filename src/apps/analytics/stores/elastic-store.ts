import dayjs from 'dayjs'
import { makeAutoObservable } from 'mobx'
import { ANALYTICS_ELASTIC_KEY } from '../../../shared/constants'
import { requestAnalyticsElastic } from '../api/elastic'

class ElasticStore {
	isLoading = false
	isLoaded = false
	error?: string = undefined

	template: IAnalyticsElasticQuery = {
		company: {
			select_field: [],
			list_where: [],
			date_limit: {
				date_from: dayjs().month(-1).format('YYYY-MM-DD'),
				date_to: dayjs().format('YYYY-MM-DD'),
				date_rounding: undefined,
			},
		},
		paginate: {
			id_record: undefined,
			limit_page: 50,
		},
	}

	data: Record<string, any>[] = []
	history: string[] = []
	id = 0
	name: string | null = ''

	setId(id: number) {
		this.id = id
	}
	setName(name: string | null) {
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
		return this.template.paginate.limit_page
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
		return !!this.template?.paginate?.id_record || false
	}
	get isPrev() {
		return this.history.length > 1
	}
	get date() {
		return this.template?.company?.date_limit
	}

	state: {
		isNext: boolean
		isPrev: boolean
	} = {
		isNext: false,
		isPrev: false,
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
	async send(page: string = '', histrory: boolean = true) {
		this.isLoading = true
		try {
			console.log(JSON.parse(JSON.stringify(this.template)))
			const select_field = [...this.template.company.select_field]
			const list_where = this.template.company.list_where
				?.filter(item => {
					return !!item.search_value
				})
				.map(item => {
					if (Array.isArray(item.search_value)) {
						if (item.search_value.length > 0) {
							return { single_action_list: 'and', ...item }
						}
					} else if (item.search_value) {
						return { single_action_list: 'and', ...item }
					}
				})
			const date_limit = { ...this.template.company.date_limit }

			if (list_where?.length && list_where?.length > 0) {
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
			this.nextPage = res.last_id_record
			this.data = res.message
		} catch (error: IError) {
			this.error = error.response?.data?.detail || error.message || 'Неизвестная ошибка'
			this.data = []
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
	clear() {
		this.template = {
			company: {
				select_field: [],
				list_where: [],
				date_limit: {
					date_from: dayjs()
						.month(dayjs().month() - 1)
						.format('YYYY-MM-DD'),
					date_to: dayjs().format('YYYY-MM-DD'),
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

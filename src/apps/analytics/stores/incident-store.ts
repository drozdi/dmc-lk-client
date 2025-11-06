import dayjs from 'dayjs'
import { makeAutoObservable } from 'mobx'
import { ANALYTICS_INCIDENT_KEY } from '../../../shared/constants'
import { requestAnalyticsIncident } from '../api/incident'

const dNow = dayjs()

class IncidentStore {
	isLoading: boolean = false
	error: string = ''
	template: {
		filterdate: any[]
		data: any[]
		fields: any[]
		details: any[]
	} = {
		filterdate: [dNow.month(dNow.month() - 3).format('YYYY-MM-DD'), dNow.format('YYYY-MM-DD')],
		data: [],
		fields: [],
		details: [],
	}
	data: IAnalyticsIncidentItem[] = []
	limit: number = 50
	constructor() {
		makeAutoObservable(this)
		const data = localStorage.getItem(ANALYTICS_INCIDENT_KEY)
		if (data) {
			try {
				this.template = JSON.parse(data)
			} catch (error) {
				console.log(error)
			}
		}
	}
	saveTemp(data: { filterdate: any[]; data: any[]; fields: any[]; details: any[] }) {
		this.template = data
		localStorage.setItem(ANALYTICS_INCIDENT_KEY, JSON.stringify(data))
	}

	async setLimit(limit: number) {
		if (limit !== this.limit) {
			this.limit = limit
			await this.send()
		}
	}
	async send() {
		this.isLoading = true
		this.error = ''
		try {
			const res = await requestAnalyticsIncident({
				filterdate: this.template.filterdate,
				limit_page: this.limit,
				data: this.template.data.map(item => item),
				fields_name: this.template.fields.map(item => item.accessorKey),
				details_field: this.template.details.map(item => item.accessorKey),
			})
			this.data = res.message as IAnalyticsIncidentItem[]
		} catch (error: IError) {
			this.error = error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}
}

export const incidentStore = new IncidentStore()

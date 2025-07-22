interface IAnalyticsQuery {
	filterdate_from?: string
	filterdate_to?: string
	step?: 's' | 'm' | 'h' | 'd' | 'mon' | 'y'
	event?: 'v' | 'i' | 'd' | 'p'
}

interface IProductionAnalytics {
	address?: string
	name: string
	production_id: number
}

interface IAnalyticsResponse {
	[key: string]: any
}
interface IAnalyticsIncidentQuery {
	filterdate?: string[]
	data?: string | string[]
	fields_name?: string | string[]
	details_field?: string | string[]
	id_record?: string
	limit_page?: number
}

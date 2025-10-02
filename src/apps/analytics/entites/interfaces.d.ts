interface IAnalyticsQuery {
	filterdate?: string[]
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

interface IAnalyticsElasticQuery {
	company: {
		select_field: string[]
		list_where?: Array<{
			name_field_table?: string
			search_value?: string | string[]
			sing_action?: '=' | '>=' | '<=' | '!=' | 'in' | 'not_in' | 'like'
			single_action_list?: 'and' | 'or' | 'not'
		}>
		date_limit: {
			date_from: string
			date_to: string
			date_rounding?: 's' | 'm' | 'h' | 'd' | 'mon' | 'y'
		}
	}
	paginate: {
		id_record?: string
		limit_page: number
	}
}
interface IAnalyticsElasticResponse {
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
interface IAnalyticsIncidentResponse {
	[key: string]: any
}

type PermittedActions = '=' | '>=' | '<=' | '!=' | 'in' | 'not_in' | 'like' | 'or'
type SliceStep = 's' | 'm' | 'h' | 'd' | 'mon' | 'y'
type SingleActionList = 'and' | 'or' | 'not'
type AnalyticEvent = 'v' | 'i' | 'd' | 'p'

interface IAnalyticsDataItem {
	data: string
	timestamp: string
	count: number
}
interface IAnalyticsProduction {
	production_id: number
	name: string
	address?: string
}
interface IAnalyticsProductionSelect {
	value: number | string
	label: string
}
interface IAnalyticsDataProduction extends IAnalyticsProduction {
	event_name: string
	all_label_prod: number
	data: IAnalyticsDataItem[]
}
interface IAnalyticsField {
	type_field: 'str' | 'int'
	permitted_actions: PermittedActions[]
	label: string
}
type IAnalyticsIncidentItem = Record<string, string | integer>
interface IAnalyticsElasticQuery {
	company: {
		select_field: string[]
		list_where?: Array<{
			name_field_table?: string
			search_value?: string | string[]
			sing_action?: PermittedActions
			single_action_list?: SingleActionList
		}>
		date_limit: {
			date_from: string
			date_to: string
			date_rounding?: SliceStep
		}
	}
	paginate: {
		id_record?: string
		limit_page: number
	}
}
interface IAnalyticsElasticQueryItem extends IAnalyticsElasticQuery {
	id: number
	name_query: string
}

interface IRequestAnalytics {
	filterdate?: string[]
	filterdate_from?: string
	filterdate_to?: string
	step?: SliceStep
	event?: 'v' | 'i' | 'd' | 'p'
}
interface IResponseAnalytics {
	id: number
	sum_company: number
	production: IAnalyticsDataProduction[]
}
interface IRequestAnalyticsFields {}
type IResponseAnalyticsFields = Record<string, IAnalyticsField>
interface IRequestAnalyticsIncident {
	filterdate?: string[]
	data?: string | string[]
	fields_name?: string | string[]
	details_field?: string | string[]
	id_record?: string
	limit_page?: number
}
type IResponseAnalyticsIncident = IAnalyticsIncidentItem[]

type IRequestAnalyticsElastic = IAnalyticsElasticQuery
interface IResponseAnalyticsElastic {
	message: Record<string, string | number>[]
	len_answer: number
	last_id_record?: string
}

/* ----------------------- */

interface IResponseAnalyticsQuery {
	page: number
	next_page: number
	previous_page: number
	size: number
	request: Array<IAnalyticsElasticQueryItem>
}

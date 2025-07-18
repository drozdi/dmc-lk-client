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

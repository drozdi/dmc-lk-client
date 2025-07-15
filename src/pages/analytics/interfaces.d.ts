interface IAnalyticsQuery {
	filterdate_from?: string
	filterdate_to?: string
	step?: 's' | 'm' | 'h' | 'd' | 'mon' | 'y'
	event?: 'v' | 'i' | 'd' | 'p'
	[key: string]: string
}

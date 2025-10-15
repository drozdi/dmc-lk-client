declare type IRequestCountLabelReset = number
declare interface IRequestCountLabelHistory {
	size?: number
	number?: number
	date_applic?: string | string[]
}
declare interface ICountLabelHistoryItem {
	format_template: string
	date_applic: string
	count_label: number
	production_id: number
	id_company: number
	place_id: number
	place_name: string
	place_type: string
	name_production: string
	device_id: number
	device_name: string
	name_company: string
	consumption_m: number | null
	id: number
	is_archive: boolean
}
declare type IResponseCountLabelHistory = Record<string, ICountLabelHistoryItem[]>

declare interface ICountLabelItem {
	add_label_format: string
	production_id: number
	sum: number
}
declare interface IResponseCountLabel {
	distributed: ICountLabelItem[]
	not_distributed: ICountLabelItem[]
}

interface IRequestCountLabelAdd {
	label_format: string
	count_label: number
	place_name: string
	production_id: number
}

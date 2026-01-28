interface ILabel {
	add_label_format: string;
	production_id: number;
	statistics_print_format: string;
	id_company: number;
	id_user: number;
	id?: number;
	format?: ILabel["add_label_format"];
	print?: ILabel["statistics_print_format"];
}

declare type IRequestCountLabelReset = number;
declare interface IRequestCountLabelHistory {
	size?: number;
	number?: number;
	filterdate?: string | string[];
}
declare interface ICountLabelHistoryItem {
	format_template: string;
	filterdate: string;
	count_label: number;
	production_id: number;
	id_company: number;
	place_id: number;
	place_name: string;
	place_type: string;
	name_production: string;
	device_id: number;
	device_name: string;
	name_company: string;
	consumption_m: number | null;
	id: number;
	is_archive: boolean;
}
declare type IResponseCountLabelHistory = Record<
	string,
	ICountLabelHistoryItem[]
>;

declare interface ICountLabelItem {
	add_label_format: string;
	production_id: number;
	sum: number;
}
declare interface IResponseCountLabel {
	distributed: ICountLabelItem[];
	not_distributed: ICountLabelItem[];
}

interface IRequestCountLabelAdd {
	label_format: string;
	count_label: number;
	place_name: string;
	production_id: number;
}

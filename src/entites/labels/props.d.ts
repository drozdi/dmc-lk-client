interface ILabel {
	add_label_format: string;
	production_id: IProduction["production_id"];
	statistics_print_format: string;
	id_company: number;
	id_user: number;
	id: number | string;
	format?: ILabel["add_label_format"];
	print?: ILabel["statistics_print_format"];
	consumption_m?: ICountLabelHistoryItem["consumption_m"];
}

interface IStoreLabels extends IStore {
	prints: Record<ILabel["production_id"], ILabel["statistics_print_format"][]>;
	loadPrints(reloading?: boolean): Promise<void>;
	formats: Record<ILabel["production_id"], ILabel["add_label_format"][]>;
	loadFormats(reloading?: boolean): Promise<void>;
	formatPrints: ILabel[];
	loadFormatPrints(reloading?: boolean): Promise<void>;

	selectPrints(
		production_id: ILabel["production_id"],
	): ILabel["statistics_print_format"][];
	selectFormats(
		production_id: ILabel["production_id"],
	): ILabel["add_label_format"][];
	selectFormatPrints(production_id: ILabel["production_id"]): ILabel[];

	addFormat(query: {
		format: ILabel["add_label_format"];
		production_id: ILabel["production_id"];
	}): Promise<ILabel | undefined>;

	deleteFormat(query: {
		format: ILabel["add_label_format"];
		production_id: ILabel["production_id"];
	}): Promise<boolean>;

	addFormatPrint(data: Partial<ILabel>): Promise<ILabel | undefined>;
	updateFormatPrint(
		id: ILabel["id"],
		data: Partial<ILabel>,
	): Promise<ILabel | undefined>;
	deleteFormatPrint(data: Partial<ILabel>): Promise<boolean>;
}

interface ICountLabelHistoryItem {
	format_template: ILabel["statistics_print_format"];
	date_applic: string;
	count_label: number;
	production_id: ILabel["production_id"];
	id_company: number;
	place_id: number;
	place_name: string;
	place_type: string;
	name_production: string;
	device_id: number;
	device_name: string;
	name_company: string;
	consumption_m: number;
	id: number;
	is_archive: boolean;
}

interface IStoreCountLabel extends IStore {
	history: ICountLabelHistoryItem[];
	count: {
		distributed: ICountLabelItem[];
		not_distributed: ICountLabelItem[];
	};
	loadHistory(reloading?: boolean): Promise<void>;
	loadCount(reloading?: boolean): Promise<void>;
	addCount(
		param: IRequestCountLabelAdd,
	): Promise<ICountLabelHistoryItem | undefined>;
	reset(production_id: ILabel["production_id"]): Promise<void>;
}

interface ICountLabelItem {
	add_label_format: ILabel["add_label_format"];
	production_id: ILabel["production_id"];
	sum: number;
	sum_consumption: number;
}

interface IRequestCountLabelHistory extends IRequestList {
	filterdate?: string | string[];
	production_id?: ILabel["production_id"] | ILabel["production_id"][];
	format_template?: ILabel["add_label_format"] | ILabel["add_label_format"][];
}

type IRequestCountLabelReset = number;

interface IRequestCountLabelAdd {
	label_format: string;
	count_label: number;
	place_name: string;
	production_id: number;
}

interface IICount {
	total_count: number;
	minus_count: number;
	plus_count: number;
	total_consumption: number;
	minus_consumption: number;
	plus_consumption: number;
}

interface ILabelItem extends IICount {
	id: ILabel["statistics_print_format"];
	_id?: ILabel["id"];
	production_id: IProduction["production_id"];
	format?: ILabel["add_label_format"] | ".default";
	print: ILabel["statistics_print_format"];
	label: ILabel["statistics_print_format"];
}

interface ILabelFormat extends IICount {
	label: ILabel["add_label_format"] | ".default";
	labels: Record<ILabel["statistics_print_format"], ILabelItem>;
}

interface ILabelProduction extends IICount {
	production_id: IProduction["production_id"];
	labels: Record<ILabelFormat["label"], ILabelFormat>;
}

interface ILabel {
	add_label_format: string;
	production_id: IProduction["production_id"];
	statistics_print_format: string;
	id_company: number;
	id_user: number;
	id: number | string;
	format?: ILabel["add_label_format"];
	print?: ILabel["statistics_print_format"];
}
interface IStoreLabels extends IStore {
	prints: Record<
		ILabel["production_id"],
		ILabel["statistics_print_format"][]
	>;
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

interface ICountLabelItem {
	add_label_format: ILabel["add_label_format"];
	production_id: ILabel["production_id"];
	sum: number;
}

interface IRequestCountLabelHistory extends IRequestList {
	filterdate?: string | string[];
}

type IRequestCountLabelReset = number;

interface IRequestCountLabelAdd {
	label_format: string;
	count_label: number;
	place_name: string;
	production_id: number;
}

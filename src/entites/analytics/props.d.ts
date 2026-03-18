type SliceStep = "s" | "m" | "h" | "d" | "mon" | "y";
type SingleActionList = "and" | "or" | "not";
type AnalyticEvent = "v" | "i" | "d" | "p";

type PermittedActions =
	| "="
	| ">="
	| "<="
	| "!="
	| "in"
	| "not_in"
	| "like"
	| "or";

interface IAnalyticsIncidentItem {
	total_counter: integer;
	data: string;
	timestamp: string;
	id: string;
	[key: string]: string | number;
}

interface IRequestAnalyticsIncident {
	filterdate: [string | Date | null, string | Date | null];
	data?: string[];
	fields_name?: string[];
}

interface IResponseAnalyticsIncident extends IResponse<
	IAnalyticsIncidentItem[]
> {
	len_answer: number;
}

interface IAnalyticsField {
	type_field: "str" | "int";
	permitted_actions: PermittedActions[];
	label: string;
}
type IResponseAnalyticsFields = Record<string, IAnalyticsField>;

interface IAnalyticsElasticQuery {
	company: {
		select_field: string[];
		list_where?: {
			name_field_table?: string;
			search_value?: string | string[];
			sing_action?: PermittedActions;
			single_action_list?: SingleActionList;
		}[];
		date_limit: {
			date_from: string;
			date_to: string;
			date_rounding?: SliceStep;
		};
	};
	paginate: {
		id_record?: IAnalyticsElasticItem["id"];
		limit_page: number;
	};
}
interface IAnalyticsElastic extends IAnalyticsElasticQuery {
	id: number;
	name_query: string;
}

interface IAnalyticsElasticItem {
	id: string;
	[key: string]: string | number;
}

interface IResponseAnalyticsElastic extends IResponse<IAnalyticsElasticItem[]> {
	len_answer: number;
	last_id_record?: IAnalyticsElasticItem["id"];
}

/* ------------------------ */

interface IAnalyticsDataItem {
	data: ILabel["statistics_print_format"];
	timestamp: string;
	count: number;
}
interface IAnalyticsProduction extends IProduction {
	name?: IProduction["name_production"];
	address?: string;
}
interface IAnalyticsProductionData extends IAnalyticsProduction {
	event_name: "PRINT" | "DEFECT" | "INCIDENT" | "VERIFY";
	all_label_prod: number;
	data: IAnalyticsDataItem[];
}

interface IRequestAnalytics {
	filterdate: [string | Date | null, string | Date | null];
	step: SliceStep;
	event: AnalyticEvent;
}
interface IResponseAnalytics {
	id: number;
	sum_company: number;
	production: IAnalyticsProductionData[];
}

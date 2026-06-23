import { $setting } from "@/shared";
import dayjs from "dayjs";
import { create } from "zustand";
import { requestAnalyticsElastic } from "../api/elastic";

interface IStoreElastic extends IStore {
	template: IAnalyticsElasticQuery;
	save(query: IAnalyticsElasticQuery): void;
	id: IAnalyticsElastic["id"];
	setId(id: IAnalyticsElastic["id"]): void;
	name_query: IAnalyticsElastic["name_query"];
	setNameQuery(name_query: IAnalyticsElastic["name_query"]): void;
	getLimit(): IAnalyticsElasticQuery["paginate"]["limit_page"];
	setLimit(limit_page: IAnalyticsElasticQuery["paginate"]["limit_page"]): void;
	getDate(): IAnalyticsElasticQuery["company"]["date_limit"];
	setDate(date: Partial<IAnalyticsElasticQuery["company"]["date_limit"]>): void;
	last_id_record: IAnalyticsElasticQuery["paginate"]["id_record"];
	data: IAnalyticsElasticItem[];
	_load(
		id_record?: IAnalyticsElasticQuery["paginate"]["id_record"],
		histrory?: boolean,
	): Promise<void>;
	history: IAnalyticsElasticQuery["paginate"]["id_record"][];
	next(): Promise<void>;
	prev(): Promise<void>;

	send(
		query: IAnalyticsElasticQuery,
	): Promise<IResponseAnalyticsElastic | undefined>;

	clear(): void;
	reset(): Promise<void>;
}

const dNow = dayjs();

export const useStoreElastic = create<IStoreElastic>((set, get) => ({
	isLoading: false,
	error: "",
	template: $setting.get("elastic.template", {
		company: {
			select_field: [],
			list_where: [],
			date_limit: {
				date_from: dNow.month(-1).format("YYYY-MM-DD"),
				date_to: dNow.format("YYYY-MM-DD"),
				date_rounding: "d",
			},
		},
		paginate: {
			id_record: undefined,
			limit_page: 50,
		},
	}),
	id: 0,
	name_query: "",
	last_id_record: "",
	data: [],
	history: [],

	setId(id) {
		set({ id });
	},
	save(template) {
		set({
			template,
		});
		$setting.set("elastic.template", template);
	},

	setNameQuery(name_query) {
		set({ name_query });
	},
	getDate() {
		return (
			get().template?.company?.date_limit || {
				date_from: dNow.month(-1).format("YYYY-MM-DD"),
				date_to: dNow.format("YYYY-MM-DD"),
				date_rounding: undefined,
			}
		);
	},
	setLimit(limit_page) {
		const template = get().template;
		set({
			template: {
				...template,
				paginate: { ...template.paginate, limit_page },
			},
		});
	},
	getLimit() {
		return get().template?.paginate?.limit_page || 50;
	},
	setDate(date) {
		const template = get().template;
		set({
			template: {
				...template,
				company: {
					...template.company,
					date_limit: {
						...template.company.date_limit,
						...date,
					},
				},
			},
		});
	},

	async _load(id_record = "", histrory = true) {
		set({
			isLoading: true,
			error: "",
		});
		const template = get().template;

		try {
			const res = await requestAnalyticsElastic({
				...template,
				paginate: {
					...template.paginate,
					id_record,
				},
			});
			set({
				isLoading: false,
				last_id_record: res.last_id_record,
				data: res.data,
				...(histrory
					? {
							history: [...get().history, id_record],
						}
					: {}),
			});
		} catch (e: IError) {
			console.error(e);
			const error =
				e?.response?.data?.detail || e?.message || e || "Неизвестная ошибка";
			set({
				isLoading: false,
				error,
			});
		}
	},

	async next() {
		await get()._load(get().last_id_record, true);
	},
	async prev() {
		const history = get().history;
		if (history.length > 1) {
			history.pop();
			set({
				history: [...history],
			});
			await this._load(history[history.length - 1], false);
		}
	},

	async reset() {
		set({
			last_id_record: "",
			history: [],
		});
		get()._load("", true);
	},
	async load() {
		await get().reset();
	},

	clear() {
		set({
			id: 0,
			name_query: "",
			template: {
				company: {
					select_field: [],
					list_where: [],
					date_limit: {
						date_from: dayjs()
							.month(dayjs().month() - 1)
							.format("YYYY-MM-DD"),
						date_to: dayjs().format("YYYY-MM-DD"),
						date_rounding: undefined,
					},
				},
				paginate: {
					id_record: "",
					limit_page: 50,
				},
			},
			last_id_record: "",
			history: [],
		});
	},

	async send(query) {
		set({
			isLoading: true,
			error: "",
		});
		try {
			const res = await requestAnalyticsElastic({
				...query,
			});
			set({
				isLoading: false,
			});
			return res;
		} catch (e: IError) {
			console.error(e);
			const error =
				e?.response?.data?.detail || e?.message || e || "Неизвестная ошибка";
			set({
				isLoading: false,
				error,
			});
		}
		return undefined;
	},
}));

export function selectIsNext(state: IStoreElastic): boolean {
	return Boolean(state.last_id_record);
}
export function selectIsPrev(state: IStoreElastic): boolean {
	return state.history.length > 1;
}

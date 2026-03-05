import { $setting } from "@/shared";
import { getterZustandMiddleware } from "@/shared/stores";
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
	limit: IAnalyticsElasticQuery["paginate"]["limit_page"];
	setLimit(limit_page: IAnalyticsElasticQuery["paginate"]["limit_page"]): void;
	date: IAnalyticsElasticQuery["company"]["date_limit"];
	setDate(date: Partial<IAnalyticsElasticQuery["company"]["date_limit"]>): void;
	last_id_record: IAnalyticsElasticQuery["paginate"]["id_record"];
	data: IAnalyticsElasticItem[];
	_load(
		id_record?: IAnalyticsElasticQuery["paginate"]["id_record"],
		histrory?: boolean,
	): Promise<void>;
	history: IAnalyticsElasticQuery["paginate"]["id_record"][];
	isNext: boolean;
	isPrev: boolean;
	next(): Promise<void>;
	prev(): Promise<void>;

	send(
		query: IAnalyticsElasticQuery,
	): Promise<IResponseAnalyticsElastic | undefined>;

	clear(): void;
	reset(): Promise<void>;
}

const dNow = dayjs();

export const useStoreElastic = create<IStoreElastic>(
	getterZustandMiddleware<IStoreElastic>((set, get) => ({
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
		save(template) {
			set({
				template,
			});
			$setting.set("elastic.template", template);
		},
		id: 0,
		setId(id) {
			set({ id });
		},
		name_query: "",
		setNameQuery(name_query) {
			set({ name_query });
		},
		get limit() {
			return get().template?.paginate?.limit_page || 50;
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
		get date() {
			return (
				get().template?.company?.date_limit || {
					date_from: dNow.month(-1).format("YYYY-MM-DD"),
					date_to: dNow.format("YYYY-MM-DD"),
					date_rounding: undefined,
				}
			);
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
		last_id_record: "",
		data: [],
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
		history: [],
		get isNext() {
			return Boolean(get().last_id_record);
		},
		get isPrev() {
			return get().history.length > 1;
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
		async load(reloading = false) {
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
	})),
);

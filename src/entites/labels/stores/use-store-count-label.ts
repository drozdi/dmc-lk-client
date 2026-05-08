import { queryClient } from "@/shared/api/query-client";
import { notification } from "@/shared/notification";
import { create } from "zustand";
import {
	requestLabelsCount,
	requestLabelsCountAdd,
	requestLabelsHistory,
	requestLabelsReset,
} from "../api";

export const useStoreCountLabel = create<IStoreCountLabel>((set, get) => ({
	isLoading: false,
	error: "",
	history: [],
	count: {
		distributed: [],
		not_distributed: [],
	},
	async load(reloading = false) {
		await get().loadHistory(reloading);
		await get().loadCount(reloading);
	},
	async loadHistory(reloading = false) {
		let loaded = !!get().history.length
		
		if (reloading) {
			loaded = false;
		}

		if (loaded) {
			return;
		}

		set({
			isLoading: true,
			error: "",
		});

		const params = {
			size: 100,
			number: 0,
			filterdate: [],
		};
		try {
			let history: ICountLabelHistoryItem[] = [];
			let res;

			do {
				res = await queryClient.fetchQuery({
					queryKey: ["labels-history", params],
					queryFn: async () => {
						return await requestLabelsHistory(params);
					},
					staleTime: 0,
					gcTime: 0,
				});
				history = [...history, ...res.data.response];
				params.number++;
			} while (history.length % params.size === 0 && res.data.response.length);
			set({
				isLoading: false,
				history,
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
	async loadCount(reloading = false) {
		let loaded = !!(get().count?.distributed?.length || get().count?.not_distributed?.length);
		
		if (reloading) {
			loaded = false;
		}
		
		if (loaded) {
			return;
		}

		set({
			isLoading: true,
			error: "",
		});

		try {
			const count = await queryClient.fetchQuery({
				queryKey: ["labels-count"],
				queryFn: async () => {
					const response = await requestLabelsCount();
					return response.data;
				},
				staleTime: 0,
				gcTime: 0,
			});

			set({
				isLoading: false,
				count,
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
	async addCount(param: IRequestCountLabelAdd) {
		set({
			isLoading: true,
			error: "",
		});
		try {
			const res = (await requestLabelsCountAdd(param)).data;
			const count = get().count;
			for (const [, colections] of Object.entries(count)) {
				const item = colections.find(
					(item) =>
						item.add_label_format === res.format_template &&
						item.production_id === res.production_id,
				);
				if (item) {
					item.sum += res.count_label;
					item.sum_consumption += res.consumption_m || 0;
				}
			}
			set(state => ({
				isLoading: false,
				history: [...state.history, res],
				count: {...count},
			}));
			notification.success(`${res.format_template} успешно пополнено на ${res.count_label} шт.`)
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
	async reset(production_id) {
		set({ isLoading: true, error: "" });
		try {
			await requestLabelsReset(production_id);
			set({ isLoading: false });
			get().load(true);
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
}));

		
export function selectHistoryForProduction (production_id: ICountLabelHistoryItem['production_id'] = 0) {
	production_id = Number(production_id) || 0
	return (state: IStoreCountLabel): ICountLabelHistoryItem[] => {
		if (!production_id) {
			return state.history
		}
		return state.history.filter(item => item.production_id === production_id)
	}
}

export const selectCountForProduction = (production_id: ICountLabelHistoryItem['production_id']): ((state: IStoreCountLabel) => {
		distributed: ICountLabelItem[];
		not_distributed: ICountLabelItem[];
	}) => {
	production_id = Number(production_id) || 0
	return (state: IStoreCountLabel): {
		distributed: ICountLabelItem[];
		not_distributed: ICountLabelItem[];
	} => {
		if (!production_id) {
			return state.count
		}
		return {
			distributed: state.count.distributed.filter(item => item.production_id === production_id),
			not_distributed: state.count.not_distributed.filter(item => item.production_id === production_id),
		}
	}
}
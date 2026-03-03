import {
	requestLabelsCount,
	requestLabelsCountAdd,
	requestLabelsHistory,
	requestLabelsReset,
} from "../api";

import { queryClient } from "@/shared/api/query-client";
import { create } from "zustand";

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
		if (reloading) {
			queryClient.removeQueries({
				queryKey: ["labels-history"],
				exact: false,
			});
		}
		if (
			queryClient
				.getQueryCache()
				.findAll({ queryKey: ["labels-history"] }).length
		) {
			return;
		}

		set({
			isLoading: false,
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
				});
				history = [...history, ...res.data.response];
				params.number++;
			} while (
				history.length % params.size === 0 &&
				res.data.response.length
			);
			set({
				isLoading: false,
				history,
			});
		} catch (e: IError) {
			console.error(e);
			const error =
				e?.response?.data?.detail ||
				e?.message ||
				e ||
				"Неизвестная ошибка";
			set({
				isLoading: false,
				error,
			});
		}
	},
	async loadCount(reloading = false) {
		if (reloading) {
			queryClient.invalidateQueries({
				queryKey: ["labels-count"],
			});
		}
		if (
			queryClient.getQueryCache().findAll({ queryKey: ["labels-count"] })
				.length
		) {
			return;
		}
		set({
			isLoading: false,
			error: "",
		});
		try {
			const count = await queryClient.fetchQuery({
				queryKey: ["labels-count"],
				queryFn: async () => {
					const response = await requestLabelsCount();
					return response.data;
				},
			});

			set({
				isLoading: false,
				count,
			});
		} catch (e: IError) {
			console.error(e);
			const error =
				e?.response?.data?.detail ||
				e?.message ||
				e ||
				"Неизвестная ошибка";
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
				}
			}
			set({
				isLoading: false,
				count,
			});
			return res;
		} catch (e: IError) {
			console.error(e);
			const error =
				e?.response?.data?.detail ||
				e?.message ||
				e ||
				"Неизвестная ошибка";
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
				e?.response?.data?.detail ||
				e?.message ||
				e ||
				"Неизвестная ошибка";
			set({
				isLoading: false,
				error,
			});
		}
	},
	selectHistory(production_id) {
		return get().history.filter(
			(item) => item.production_id === production_id,
		);
	},
}));

import {
	requestLabelsCount,
	requestLabelsCountAdd,
	requestLabelsCountHistory,
	requestLabelsCountReset,
} from "../api";

import { queryClient } from "@/shared/api/query-client";
import { create } from "zustand";

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
	): Promise<ICountLabelItem | undefined>;
	reset(production_id: ILabel["production_id"]): Promise<void>;
}

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
			queryClient.invalidateQueries({
				queryKey: ["labels-history"],
			});
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
				res = await requestLabelsCountHistory(params);
				for (const arr of Object.values(res.data.response)) {
					history = [...history, ...arr];
				}
				params.number++;
			} while (
				history.length % params.size === 0 &&
				Object.values(res.data.response).length
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
		set({
			isLoading: false,
			error: "",
		});
		try {
			const count = (await requestLabelsCount()).data;
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
			set({
				isLoading: false,
			});
			get().load(true);
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
			await requestLabelsCountReset(production_id);
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
}));

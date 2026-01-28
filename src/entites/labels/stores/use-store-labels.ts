import {
	requestLabelsFormatAdd,
	requestLabelsFormatAll,
	requestLabelsJoinedAdd,
	requestLabelsJoinedDelete,
	requestLabelsJoinedList,
	requestLabelsJoinedUpdate,
	requestLabelsPrintAll,
} from "../api";

import { queryClient } from "@/shared/api/query-client";
import { getterZustandMiddleware } from "@/shared/stores";
import { create } from "zustand";

interface IStoreLabels extends IStore {
	prints: Record<string, string[]>;
	loadPrints(reloading?: boolean): Promise<void>;
	formats: Record<string, string[]>;
	loadFormats(reloading?: boolean): Promise<void>;
	formatPrints: Record<string, ILabel[]>;
	loadFormatPrints(reloading?: boolean): Promise<void>;
	addFormat(query: { format: string; production_id: number }): Promise<void>;

	addFormatPrint(data: Partial<ILabel>): Promise<void>;
	deleteFormatPrint(data: Partial<ILabel>): Promise<void>;
	updateFormatPrint(id: ILabel["id"], data: Partial<ILabel>): Promise<void>;
}

export const useStoreLabels = create<IStoreLabels>(
	getterZustandMiddleware((set, get) => ({
		isLoading: false,
		error: "",
		prints: {},
		formats: {},
		formatPrints: {},
		async loadPrints(reloading = false) {
			if (reloading) {
				queryClient.invalidateQueries({
					queryKey: ["labels-prints"],
				});
			}
			set({
				isLoading: true,
				error: "",
			});

			try {
				const prints = await queryClient.fetchQuery({
					queryKey: ["labels-prints"],
					queryFn: async () => {
						const response = await requestLabelsPrintAll();
						return response.data;
					},
				});
				set({
					isLoading: false,
					prints,
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
		async loadFormats(reloading: boolean = false) {
			if (reloading) {
				queryClient.invalidateQueries({
					queryKey: ["labels-formats"],
				});
			}
			set({
				isLoading: true,
				error: "",
			});
			try {
				const formats = await queryClient.fetchQuery({
					queryKey: ["labels-formats"],
					queryFn: async () => {
						const response = await requestLabelsFormatAll();
						return response.data;
					},
				});

				set({
					isLoading: false,
					formats,
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
		async loadFormatPrints(reloading: boolean = false) {
			if (reloading) {
				queryClient.invalidateQueries({
					queryKey: ["labels-format-prints"],
				});
			}
			set({
				isLoading: true,
				error: "",
			});

			try {
				const res = await requestLabelsJoinedList({
					size: 100,
					number: 0,
				});

				const formatPrints = Object.fromEntries(
					Object.entries(res.data.response).map(([key, items]) => {
						return [
							String(key),
							items
								.filter(
									(item) =>
										item.add_label_format !==
										item.statistics_print_format,
								)
								.map((item) => ({
									...item,
									format: item.add_label_format,
									print: item.statistics_print_format,
								})),
						];
					}),
				);

				set({
					isLoading: false,
					formatPrints,
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
		async load(reloading = false) {
			get().loadPrints(reloading);
			get().loadFormats(reloading);
			get().loadFormatPrints(reloading);
		},

		async addFormat({ format, production_id }) {
			if (!format.trim()) {
				set({
					error: "Название не может быть пустым",
				});
				return;
			}
			set({
				isLoading: true,
				error: "",
			});

			try {
				const res = (
					await requestLabelsFormatAdd({
						format: (format as string).trim(),
						production_id,
					})
				).data;
				const formats = get().formats;
				const formatPrints = get().formatPrints;
				set({
					isLoading: false,
					formats: {
						...formats,
						[String(res.production_id)]: [
							...(formats[String(res.production_id)] || []),
							res.add_label_format,
						],
					},
					formatPrints: {
						...formatPrints,
						[String(res.production_id)]: [
							...(formatPrints[String(res.production_id)] || []),
							{
								...res,
								format: res.add_label_format,
								print: res.statistics_print_format,
							},
						],
					},
				});
				await get().loadFormatPrints(true);
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

		async addFormatPrint(data) {
			set({
				isLoading: true,
				error: "",
			});

			try {
				const res = (await requestLabelsJoinedAdd(data)).data;
				const formatPrints = get().formatPrints;
				set({
					isLoading: false,
					formatPrints: {
						...formatPrints,
						[String(res.production_id)]: [
							...(formatPrints[String(res.production_id)] || []),
							{
								...res,
								format: res.add_label_format,
								print: res.statistics_print_format,
							},
						],
					},
				});
				await get().loadFormatPrints(true);
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
		async deleteFormatPrint(data) {
			set({
				isLoading: true,
				error: "",
			});

			try {
				await requestLabelsJoinedDelete(data.id);
				await get().loadFormatPrints(true);
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
		async updateFormatPrint(id, data) {
			set({
				isLoading: true,
				error: "",
			});

			try {
				await requestLabelsJoinedUpdate(Number(id), {
					...((
						get().formatPrints[String(data.production_id)] || []
					).find((item) => String(item.id) === String(id)) || {}),
					...data,
				});
				await get().loadFormatPrints(true);
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
	})),
);

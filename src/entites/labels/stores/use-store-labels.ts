import {
	requestLabelsFormatAdd,
	requestLabelsFormatDelete,
	requestLabelsFormatList,
	requestLabelsJoinedAdd,
	requestLabelsJoinedDelete,
	requestLabelsJoinedList,
	requestLabelsJoinedUpdate,
	requestLabelsPrintList,
} from "../api";

import { queryClient } from "@/shared/api/query-client";
import { create } from "zustand";

export const useStoreLabels = create<IStoreLabels>((set, get) => ({
	isLoading: false,
	error: "",
	prints: {},
	formats: {},
	formatPrints: [],

	async load(reloading = false) {
		await get().loadPrints(reloading);
		await get().loadFormats(reloading);
		await get().loadFormatPrints(reloading);
	},

	async loadPrints(reloading = false) {
		if (reloading) {
			queryClient.removeQueries({
				queryKey: ["labels-prints"],
				exact: false,
			});
		}
		if (
			queryClient.getQueryCache().findAll({ queryKey: ["labels-prints"] })
				.length
		) {
			return;
		}

		set({
			isLoading: true,
			error: "",
		});

		try {
			const prints = await queryClient.fetchQuery({
				queryKey: ["labels-prints"],
				queryFn: async () => {
					const response = await requestLabelsPrintList();
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
			queryClient.removeQueries({
				queryKey: ["labels-formats"],
				exact: false,
			});
		}
		if (
			queryClient
				.getQueryCache()
				.findAll({ queryKey: ["labels-formats"] }).length
		) {
			return;
		}
		set({
			isLoading: true,
			error: "",
		});
		try {
			const formats = await queryClient.fetchQuery({
				queryKey: ["labels-formats"],
				queryFn: async () => {
					const response = await requestLabelsFormatList();
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
			queryClient.removeQueries({
				queryKey: ["labels-format-prints"],
				exact: false,
			});
		}
		if (
			queryClient
				.getQueryCache()
				.findAll({ queryKey: ["labels-format-prints"] }).length
		) {
			return;
		}
		set({
			isLoading: true,
			error: "",
		});

		const params = {
			size: 100,
			number: 0,
		};
		try {
			let formatPrints: ILabel[] = [];
			let res;
			do {
				res = await requestLabelsJoinedList(params);
				formatPrints = [
					...formatPrints,
					...(res?.data?.response || [])
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
				params.number = params.number + 1;
			} while (res.success && res?.data?.response?.length >= params.size);

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
	selectPrints(production_id) {
		return get().prints[production_id] || [];
	},
	selectFormats(production_id) {
		return get().formats[production_id] || [];
	},
	selectFormatPrints(production_id) {
		return get().formatPrints.filter(
			(item) => String(item.production_id) === String(production_id),
		);
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
			set({
				isLoading: false,
				formats: {
					...formats,
					[String(res.production_id)]: [
						...(formats[String(res.production_id)] || []),
						res.add_label_format,
					],
				},
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

	async deleteFormat({ format, production_id }) {
		set({
			isLoading: true,
			error: "",
		});

		try {
			await requestLabelsFormatDelete({
				format,
				production_id,
			});
			const { formats, formatPrints } = get();
			set({
				isLoading: false,
				formats: {
					...formats,
					[production_id]: (formats[production_id] || []).filter(
						(item) => item !== format,
					),
				},
				formatPrints: formatPrints.filter(
					(item) =>
						item.production_id === production_id &&
						item.add_label_format !== format,
				),
			});
			return true;
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
		return false;
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
				formatPrints: [
					...formatPrints,
					{
						...res,
						format: res.add_label_format,
						print: res.statistics_print_format,
					},
				],
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
	async updateFormatPrint(id, data) {
		set({
			isLoading: true,
			error: "",
		});

		try {
			const res = (
				await requestLabelsJoinedUpdate(Number(id), {
					...(get().formatPrints.find(
						(item) => String(item.id) === String(id),
					) || {}),
					...data,
				})
			).data;
			set({
				isLoading: false,
				formatPrints: get().formatPrints.map((item) =>
					String(item.id) === String(res.id) ? res : item,
				),
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
	async deleteFormatPrint(data) {
		set({
			isLoading: true,
			error: "",
		});

		try {
			await requestLabelsJoinedDelete(data.id);
			set({
				isLoading: false,
				formatPrints: get().formatPrints.filter(
					(item) => String(item.id) !== String(data.id),
				),
			});
			await get().loadFormatPrints(true);
			return true;
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
		return false;
	},
}));

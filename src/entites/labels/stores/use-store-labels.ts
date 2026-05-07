import { queryClient } from "@/shared/api/query-client";
import { notification } from "@/shared/notification";
import { create } from "zustand";
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
		let loaded = !!Object.keys(get().prints).length
		if (reloading) {
			loaded = false
		}
		if (loaded) {
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
				staleTime: 0,
				gcTime: 0,
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
	async loadFormats(reloading = false) {
		let loaded = !!Object.keys(get().formats).length
		if (reloading) {
			loaded = false
		}
		if (loaded) {
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
				staleTime: 0,
				gcTime: 0,
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


		try {
			const formatPrints = await queryClient.fetchQuery({
				queryKey: ["labels-formats"],
				queryFn: async () => {
					let formatPrints: ILabel[] = []
					let response = {}
					const params = {
						size: 100,
						number: 0,
					};
					do {
						response = await requestLabelsJoinedList(params);
						formatPrints = [
							...formatPrints,
							...(response?.data?.response || [])
								.filter(
									(item) =>
										!item.is_reference_template,
								)
								.map((item) => ({
									...item,
									format: item.add_label_format,
									print: item.statistics_print_format,
								}))
						]
						params.number++
					} while (response.success && response?.data?.response?.length >= params.size);

					return formatPrints;
				},
				staleTime: 0,
				gcTime: 0,
			});

			set({
				isLoading: false,
				formatPrints: formatPrints.filter(item => !item.is_reference_template),
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
			(item) => item.production_id === production_id,
		);
	},

	async addFormat({ format, print, production_id }) {
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
					add_label_format: format,
					statistics_print_format: print,
					production_id,
				})
			).data;
			
			set(state => ({
				isLoading: false,
				formats: {
					...state.formats,
					[res[0].production_id]: [
						...(state.formats[res[0].production_id] || []),
						...res.filter(item => item.is_reference_template),
					],
				},
				formatPrints: [...state.formatPrints, ...res.filter(item => !item.is_reference_template)]
			}));
			
			notification.success(
				`Группа этикеток "${res[0].add_label_format} (${res[0].statistics_print_format})" успешно добавлена!`,
			);
			return res;
		} catch (e: IError) {
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

			set(state => ({
				isLoading: false,
				formats: {
					...state.formats,
					[production_id]: (state.formats[production_id] || []).filter(
						(item) => item.add_label_format !== format,
					),
				},
				formatPrints: state.formatPrints.filter(
					(item) =>
						item.production_id === production_id &&
						item.add_label_format !== format,
				),
			}));
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

	async updateFormat () {

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
			notification.success(`Этикетка "${res.statistics_print_format}" добавлена в группу "${res.add_label_format}"`)
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
			set(state => ({
				isLoading: false,
				formatPrints: state.formatPrints.map((item) =>
					item.id === res.id ? {...res, format: res.add_label_format, print: res.statistics_print_format} : item,
				),
			}));
			notification.success(`Этикетка "${res.statistics_print_format}" перемещена в группу "${res.add_label_format}"`)
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
			set(state => ({
				isLoading: false,
				formatPrints: state.formatPrints.filter(
					(item) => item.id !== data.id,
				),
			}));
			notification.success(`Этикетка "${data.statistics_print_format}" убранна из групп"`)
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


export function selectPrintsForProduction(): ((state: IStoreLabels) =>  Record<ILabel["production_id"], ILabel["statistics_print_format"][]>)
export function selectPrintsForProduction(production_id: ILabel["production_id"]): ((state: IStoreLabels) => ILabel["statistics_print_format"][])
export function selectPrintsForProduction (production_id: ILabel["production_id"] = 0) {
	production_id = Number(production_id) || 0;
	return (state: IStoreLabels) => {
		if (production_id) {
			return state.prints[production_id] || []
		}
		return state.prints
	}
}

export function selectFormatForProduction(): ((state: IStoreLabels) =>  Record<ILabel["production_id"], ILabel[]>)
export function selectFormatForProduction(production_id: ILabel["production_id"]): ((state: IStoreLabels) => ILabel[])
export function selectFormatForProduction (production_id: ILabel["production_id"] = 0) {
	production_id = Number(production_id) || 0;
	return (state: IStoreLabels) => {
		if (production_id) {
			return state.formats[production_id] || []
		}
		return state.formats
	}
}

export function selectSelectFormatPrintsForProduction (production_id: ILabel["production_id"] = 0): ((state: IStoreLabels) => ILabel[]) {
	production_id = Number(production_id) || 0;
	return (state: IStoreLabels) => {
		if (production_id) {
			return state.formatPrints.filter(
				(item) => item.production_id === production_id
			)
		}
		return state.formatPrints
	}
}
import { $setting } from "@/shared";
import dayjs from "dayjs";
import { create } from "zustand";
import { requestAnalyticsIncident } from "../api/incident";

interface IStoreIncident extends IStore {
	template: IRequestAnalyticsIncident;
	data: IAnalyticsIncidentItem[];
	limit: IRequestAnalyticsIncident["limit_page"];
	setLimit(limit: IRequestAnalyticsIncident["limit_page"]): void;
	load(reloading?: boolean): Promise<void>;
	save(query: IRequestAnalyticsIncident): void;
	send(
		query: IRequestAnalyticsIncident,
	): Promise<IAnalyticsIncidentItem[] | undefined>;
}

const dNow = dayjs();

export const useStoreIncident = create<IStoreIncident>((set, get) => ({
	isLoading: false,
	error: "",
	data: [],
	limit: $setting.get("incident.limit", 50),
	template: $setting.get("incident", {
		filterdate: [
			dNow.month(dNow.month() - 3).format("YYYY-MM-DD"),
			dNow.format("YYYY-MM-DD"),
		],
		data: [],
		fields: [],
		details: [],
	}),
	setLimit(limit) {
		set({ limit });
	},

	save(query) {
		const limit = query.limit_page || get().limit;
		const template = {
			filterdate: [],
			data: [],
			fields: [],
			details: [],
			...query,
			id_record: undefined,
			limit_page: undefined,
		};
		set({
			template,
			limit,
		});
		$setting.set("incident", template);
	},
	async load(reloading = false) {
		const res = await get().send(get().template);
		if (res) {
			set({
				data: res,
			});
		}
	},
	async send(query) {
		set({
			isLoading: true,
			error: "",
		});
		try {
			const res = (
				await requestAnalyticsIncident({
					limit_page: get().limit,
					...query,
				})
			).message;
			set({
				isLoading: false,
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
}));

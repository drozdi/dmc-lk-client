import { $setting } from "@/shared";
import dayjs from "dayjs";
import { create } from "zustand";
import { requestAnalyticsIncident } from "../api/incident";

interface IStoreIncident extends IStore {
	template: IRequestAnalyticsIncident;
	data: IAnalyticsIncidentItem[];
	load(reloading?: boolean): Promise<void>;
	save(query: IRequestAnalyticsIncident): void;
	send(
		query: IRequestAnalyticsIncident,
	): Promise<IResponseAnalyticsIncident | undefined>;
}

const dNow = dayjs();

export const useStoreIncident = create<IStoreIncident>((set, get) => ({
	isLoading: false,
	error: "",
	data: [],
	template: $setting.get("incident", {
		filterdate: [
			dNow.month(dNow.month() - 3).format("YYYY-MM-DD"),
			dNow.format("YYYY-MM-DD"),
		],
		data: [],
		fields_name: [],
	}),

	save(query) {
		const template = {
			data: [],
			fields: [],
			...query,
		};
		set({
			template,
		});
		$setting.set("incident", template);
	},
	async load(reloading = false) {
		const res = await get().send(get().template);
		if (res) {
			set({
				data: res.data,
			});
		}
	},
	async send(query) {
		set({
			isLoading: true,
			error: "",
		});
		try {
			const res = await requestAnalyticsIncident({
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

import {
	requestPageSettingAdd,
	requestPageSettingGet,
	requestPageSettingUpdate,
} from "@/entites/auth/api/page_setting";
import { $setting } from "@/shared";
import { dbMiddleware } from "@/shared/stores/utils/db-persist";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FactoryWidget } from "./factory-widget";

interface FactoryDashboardStoreProps {
	storageKey?: string;
	availableWidgets?: WidgetContextType["availableWidgets"];
	varibles?: WidgetContextType["varibles"];
	key?: WidgetContextType["key"];
}

const dashboardFactory =
	({
		storageKey = "",
		availableWidgets = [],
		varibles = {},
		key = "i",
	}): ((
		props: FactoryDashboardStoreProps,
	) => (set: any, get: any, api: any) => WidgetContextType) =>
	(set, get, api) => ({
		key,
		widgets: [],
		layouts: [],
		varibles,
		preview: {},
		availableWidgets,
		edit: false,
		id: 0,
		values: {},
		setValue: (key, val) => {
			set((state) => ({
				values: {
					...state.values,
					[key.startsWith("$") ? key : "$" + key]: val,
				},
			}));
		},
		getValue: (varible) => {
			if (typeof varible === "string" && varible.startsWith("$")) {
				return get().values[varible] ?? get().varibles[varible]?.default;
			}
			return varible;
		},
		clear: () => {
			set({
				id: 0,
				preview: {},
			});
		},
		toggleEdit: () => {
			set((state) => ({
				edit: !state.edit,
			}));
		},
		updateLayout: (layouts) => set({ layouts }),
		registerWidget: (widget) => {
			if (!widget.type) {
				return;
			}
			set((state) => ({
				availableWidgets: [...state.availableWidgets, widget.type],
			}));
		},
		addWidget: (widget, layout = {}) => {
			const key = get().key;
			widget.id = widget.id || `widget.${Date.now()}`;
			if (get().widgets.findIndex((item) => item.id === widget.id) > -1) {
				return;
			}
			set((state) => ({
				widgets: [...state.widgets, widget],
				layouts: [
					...state.layouts,
					{
						...{
							[key]: widget.id,
							x: (state.layouts.length * 2) % 12,
							y: Infinity,
							w: 3,
							h: 2,
						},
						...layout,
					} as ILayoutItem,
				],
			}));
		},
		removeWidget: (widget) => {
			const key = get().key;
			set((state) => ({
				widgets: state.widgets.filter((w) => w.id !== widget.id),
				layouts: state.layouts.filter((l) => l[key] !== widget.id),
			}));
		},
		updateWidget: (widget, layout = {}) => {
			const key = get().key;
			set((state) => ({
				widgets: state.widgets.map((item) =>
					item.id === widget.id ? widget : item,
				),
				layouts: state.layouts.map((item) =>
					item[key] === widget.id ? { ...item, ...layout } : item,
				),
			}));
		},
		renderWidget: (widget) => {
			const params = { ...widget.params };
			for (let key in params) {
				params[key] = get().getValue(params[key]);
			}
			return FactoryWidget.create(widget.type, params || {});
		},
		hasWidget: (type: IWidget["type"]) => {
			return (
				FactoryWidget.getAvailableTypes().includes(type) &&
				get().availableWidgets.includes(type)
			);
		},
		editWidget: (widget) => {
			set({ id: widget.id });
		},
		findWidget(id) {
			return get().widgets.find((w) => w.id === id);
		},
		reset: () => {
			set({ widgets: [], layouts: [] });
		},
	});

export const factoryDashboardStore = ({
	storageKey = "",
	availableWidgets = [],
	varibles = {},
	key = "i",
}: FactoryDashboardStoreProps) => {
	return create<WidgetContextType>(
		dbMiddleware<WidgetContextType>(
			dashboardFactory({
				storageKey,
				availableWidgets,
				varibles,
				key,
			}),
			{
				key: `widget.${storageKey}`,
				default: {},
				load: async (key): Promise<Partial<WidgetContextType>> => {
					let res = {};
					try {
						res = (await requestPageSettingGet(key)).data?.meaning || {
							widgets: [],
							layouts: [],
							values: {},
						};
					} catch (e) {}
					return {
						widgets: [],
						layouts: [],
						values: {},
						...res,
					};
				},
				save: async (key, state) => {
					try {
						await requestPageSettingUpdate(key, {
							meaning: {
								widgets: state.widgets || [],
								layouts: state.layouts || [],
								values: state.values || {},
							},
						});
					} catch (e) {
						await requestPageSettingAdd({
							setting_name: key,
							meaning: {
								widgets: state.widgets || [],
								layouts: state.layouts || [],
								values: state.values || {},
							},
						});
					}
				},
				delay: 5000,
				loadOnInit: true,
			},
		),
	);
};

export const oldFactoryDashboardStore = ({
	storageKey = "",
	availableWidgets = [],
	varibles = {},
	key = "i",
}: {
	storageKey?: string;
	availableWidgets?: WidgetContextType["availableWidgets"];
	varibles?: WidgetContextType["varibles"];
	key?: WidgetContextType["key"];
}) => {
	return create<WidgetContextType>()(
		persist(
			dashboardFactory({
				storageKey,
				availableWidgets,
				varibles,
				key,
			}),
			{
				name: $setting.key(`dashboard.${storageKey}`),
				partialize: (state) => ({
					widgets: state.widgets,
					layouts: state.layouts,
					values: state.values,
				}),
			},
		),
	);
};

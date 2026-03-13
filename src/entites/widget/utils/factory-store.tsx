import { $setting } from "@/shared";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FactoryWidget } from "./factory-widget";

export const factoryDashboardStore = ({
	storageKey = "",
	availableWidgets = [],
	key = "i",
}: {
	storageKey?: string;
	availableWidgets?: WidgetContextType["availableWidgets"];
	key?: WidgetContextType["key"];
}) => {
	return create<WidgetContextType>()(
		persist(
			(set, get) => ({
				key,
				widgets: [],
				layouts: [],
				preview: {},
				availableWidgets,
				edit: false,
				id: 0,
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
					return FactoryWidget.create(widget.type, widget.params || {});
				},
				hasWidget: (type: IWidget["type"]) => {
					return (
						FactoryWidget.getAvailableTypes().includes(type) &&
						get().availableWidgets.includes(type)
					);
				},
				findWidget(id) {
					return get().widgets.find((w) => w.id === id);
				},
				reset: () => {
					set({ widgets: [], layouts: [] });
				},
			}),
			{
				name: $setting.key(`dashboard.${storageKey}`),
				partialize: (state) => ({
					widgets: state.widgets,
					layouts: state.layouts,
				}),
			},
		),
	);
};

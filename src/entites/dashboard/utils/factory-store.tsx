import { $setting } from "@/shared";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const factoryDashboardStore = ({
	storageKey = "",
	availableWidgets = {},
	key = "i",
}: {
	storageKey?: string;
	availableWidgets?: Record<IWidget["type"], IWidget>;
	key?: string;
}) => {
	return create<DashboardContextType>()(
		persist(
			(set, get) => ({
				key,
				widgets: [],
				layouts: [],
				availableWidgets,
				showed: [],
				addShowed: (id) => {
					set((state) => ({
						showed: [...state.showed, id],
					}));
				},
				updateLayout: (layouts) => set({ layouts }),
				registerWidget: (widget: IWidget) => {
					if (!widget.type) {
						return;
					}
					set((state) => ({
						availableWidgets: {
							...state.availableWidgets,
							[widget.type]: widget,
						},
					}));
				},
				addWidget: (widget) => {
					const key = get().key;
					widget.id = widget.id || `widget.${Date.now()}`;
					if (
						get().widgets.findIndex(
							(item) => item.id === widget.id,
						) > -1
					) {
						return;
					}
					set((state) => ({
						widgets: [...state.widgets, widget],
						layouts: [
							...state.layouts,
							{
								[key]: widget.id,
								x: (state.layouts.length * 2) % 12,
								y: Infinity,
								w: 3,
								h: 2,
							} as ILayoutItem,
						],
					}));
				},
				removeWidget: (widget) => {
					const key = get().key;
					set((state) => ({
						widgets: state.widgets.filter(
							(w) => w.id !== widget.id,
						),
						layouts: state.layouts.filter(
							(l) => l[key] !== widget.id,
						),
					}));
				},
				renderWidget: (widget) => {
					const Component =
						get().availableWidgets[widget.type]?.component;
					if (!Component) {
						return undefined;
					}
					const params = widget.params;
					if (!widget.fixed && widget.id) {
						params.onRemove = () => {
							get().removeWidget(widget);
						};
					}
					return <Component {...params} />;
				},
				hasWidget: (type: IWidget["type"]) => {
					return Boolean(get().availableWidgets[type]);
				},
				findWidget: (id: IWidget["id"]) => {
					return get().showed.includes(id)
						? undefined
						: get().widgets.find((w) => w.id === id);
				},
				clear: () => {
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

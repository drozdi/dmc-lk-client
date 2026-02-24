import { create } from "zustand";
import { persist } from "zustand/middleware";

export const createDashboardStore = (
	storageKey: string,
	availableWidgets: string[],
) => {
	return create<DashboardContextType>()(
		persist(
			(set, get) => ({
				widgets: [],
				layouts: [],
				availableWidgets: [],
				clear: () => set({ widgets: [], layouts: [] }),
				updateLayout: (layouts) => set({ layouts }),
				registerWidget: (widget: IWidget) => {},
				addWidget: (widget) => {
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
								i: widget.id,
								x: (state.layouts.length * 2) % 12,
								y: Infinity,
								w: 3,
								h: 2,
								minW: 2,
								minH: 2,
							} as ILayoutItem,
						],
					}));
				},
				removeWidget: (widget) => {
					set((state) => ({
						widgets: state.widgets.filter(
							(w) => w.id !== widget.id,
						),
						layouts: state.layouts.filter((l) => l.i !== widget.id),
					}));
				},
				renderWidget: (widget) => {},
				hasWidget: (type: IWidget["type"]) => {
					return availableWidgets.includes(type);
				},
			}),
			{
				name: `dashboard.${storageKey}`,
				partialize: (state) => ({
					widgets: state.widgets,
					layouts: state.layouts,
				}),
			},
		),
	);
};

/**
	
 * 
 * 
 */

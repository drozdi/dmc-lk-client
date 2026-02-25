import { $setting } from "@/shared";
import { createContext, useCallback, useContext, useState } from "react";

interface DashboardProviderProps {
	children: React.ReactNode;
	storageKey: string;
	availableWidgets?: Record<IWidget["type"], IWidget>;
	initialWidgets?: IWidget[];
	initialLayouts?: ILayoutItem[];
}

const DashboardContext = createContext<DashboardContextType | undefined>(
	undefined,
);

export const DashboardProvider: React.FC<DashboardProviderProps> = ({
	children,
	storageKey,
	availableWidgets = {},
	initialWidgets = [],
	initialLayouts = [],
}) => {
	const [acceptableWidgets, setAcceptableWidgets] =
		useState<Record<IWidget["type"], IWidget>>(availableWidgets);
	const [widgets, setWidgets] = $setting.useState<IWidget[]>(
		`dashboard.${storageKey}.widgets`,
		initialWidgets,
	);
	const [layouts, setLayouts] = $setting.useState<ILayoutItem[]>(
		`dashboard.${storageKey}.layouts`,
		initialLayouts,
	);
	const [showed, setShowed] = useState<IWidget["id"][]>([]);

	const addShowed = useCallback((id: IWidget["id"]): void => {
		setShowed((v) => [...v, id]);
	}, []);

	const updateLayout = useCallback((newLayout: ILayoutItem[]) => {
		setLayouts(newLayout);
	}, []);

	const registerWidget = useCallback((widget: IWidget) => {
		if (!widget.type) {
			return;
		}
		setAcceptableWidgets((v) => {
			if (v[widget.type]) {
				return v;
			}

			return {
				...v,
				[widget.type]: widget,
			};
		});
	}, []);

	const addWidget = (widget: IWidget) => {
		widget.id = widget.id || `widget.${Date.now()}`;
		if (widgets.findIndex((item) => item.id === widget.id) > -1) {
			return;
		}
		setWidgets((widgets) => [...widgets, widget]);
		setLayouts((layouts) => [
			...layouts,
			{
				i: widget.id,
				x: (layouts.length * 2) % 12,
				y: Infinity,
				w: 3,
				h: 2,
				minW: 2,
				minH: 2,
			} as ILayoutItem,
		]);
	};

	const removeWidget = useCallback((widget: IWidget) => {
		setWidgets((widgets) => widgets.filter((w) => w.id !== widget.id));
		setLayouts((layouts) => layouts.filter((l) => l.i !== widget.id));
	}, []);

	const renderWidget = (widget: IWidget) => {
		const Component = acceptableWidgets[widget.type]?.component;
		const params = widget.params;
		if (!widget.fixed) {
			params.onRemove = () => removeWidget(widget);
		}
		return <Component {...params} />;
	};
	// FactoryWidget.create(type, props);

	const hasWidget = (type: IWidget["type"]) =>
		Boolean(acceptableWidgets[type]);

	return (
		<DashboardContext.Provider
			value={{
				widgets,
				layouts,
				addWidget,
				removeWidget,
				updateLayout,
				renderWidget,
				registerWidget,
				hasWidget,
				addShowed,
				findWidget: (id: IWidget["id"]) =>
					showed.includes(id)
						? undefined
						: widgets.find((w) => w.id === id),
				clear: () => {
					setWidgets(initialWidgets);
					setLayouts(initialLayouts);
					setShowed([]);
				},
			}}
		>
			{children}
		</DashboardContext.Provider>
	);
};

export const useDashboard = () => {
	const context = useContext(DashboardContext);
	if (!context) {
		throw new Error("useDashboard must be used within DashboardProvider");
	}
	return context;
};

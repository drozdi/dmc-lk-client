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

	const [def, setDef] = $setting.useState<IWidget["id"][]>(
		`dashboard.${storageKey}.default`,
		[],
	);

	const [widgets, setWidgets] = $setting.useState<IWidget[]>(
		`dashboard.${storageKey}.widgets`,
		initialWidgets,
	);

	const [layouts, setLayouts] = $setting.useState<ILayoutItem[]>(
		`dashboard.${storageKey}.layouts`,
		initialLayouts,
	);

	const updateLayout = useCallback((newLayout: ILayoutItem[]) => {
		setLayouts(newLayout);
	}, []);

	const registerWidget = (widget: IWidget) => {
		if (!widget.type || acceptableWidgets[widget.type]) {
			return;
		}
		setAcceptableWidgets((v) => ({
			...v,
			[widget.type]: widget,
		}));
	};

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

	const addDefault = (widget: IWidget) => {
		widget.id = widget.id || `widget.${Date.now()}`;
		if (def.includes(widget.id)) {
			return;
		}
		setDef((v) => [...v, widget.id]);
		addWidget(widget);
	};

	const removeWidget = useCallback((widget: IWidget) => {
		setWidgets((widgets) => widgets.filter((w) => w.id !== widget.id));
		setLayouts((layouts) => layouts.filter((l) => l.i !== widget.id));
	}, []);

	const renderWidget = (widget: IWidget) => {
		const Component = acceptableWidgets[widget.type]?.component;
		return (
			<Component
				{...widget.params}
				onRemove={() => removeWidget(widget)}
			/>
		);
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
				addDefault,
				removeWidget,
				updateLayout,
				renderWidget,
				registerWidget,
				hasWidget,
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

import { $setting } from "@/shared";
import { createContext, useContext, useState } from "react";

interface DashboardContextType {
	widgets: IWidget[];
	layouts: ILayoutItem[];
	addWidget: (type: IWidget["type"], title?: IWidget["title"]) => void;
	removeWidget: (id: IWidget["id"]) => void;
	updateLayout: (newLayout: ILayoutItem[]) => void;
	renderWidget: (type: IWidget["type"], props: any) => React.ReactNode;
	hasWidget: (type: IWidget["type"]) => boolean;
	registerWidget: (widget: IWidget) => void;
}

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

	const updateLayout = (newLayout: ILayoutItem[]) => {
		setLayouts(newLayout);
	};

	const registerWidget = (widget: IWidget) => {
		if (!widget.type || acceptableWidgets[widget.type]) {
			return;
		}
		setAcceptableWidgets((v) => ({
			...v,
			[widget.type]: widget,
		}));
	};

	const addWidget = (type: IWidget["type"], title?: IWidget["title"]) => {
		const newId = `widget.${Date.now()}`;
		setWidgets([
			...widgets,
			{
				id: newId,
				type,
				title: title || type,
			} as IWidget,
		]);
		setLayouts([
			...layouts,
			{
				i: newId,
				x: (layouts.length * 2) % 12,
				y: Infinity,
				w: 3,
				h: 2,
				minW: 2,
				minH: 2,
			} as ILayoutItem,
		]);
	};

	const removeWidget = (id: IWidget["id"]) => {
		setWidgets(widgets.filter((w) => w.id !== id));
		setLayouts(layouts.filter((l) => l.i !== id));
	};

	const renderWidget = (type: IWidget["type"], props: any) => {
		const widget = acceptableWidgets[type];
		if (widget?.params) {
			const Component = widget.component;
		} else if (widget?.children) {
			return <div {...props}>{widget.children}</div>;
		}
		return <div>Unknown widget type: {type}</div>;
	};
	// FactoryWidget.create(type, props);

	const hasWidget = (type: IWidget["type"]) =>
		Boolean(widgets.find((item) => item.type === type));

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

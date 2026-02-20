import { $setting } from "@/shared";
import { createContext, useContext } from "react";
import FactoryWidget from "../utils/factory-widget";

interface DashboardContextType {
	widgets: IWidget[];
	layouts: ILayoutItem[];
	addWidget: (type: IWidget["type"], title?: IWidget["title"]) => void;
	removeWidget: (id: IWidget["id"]) => void;
	updateLayout: (newLayout: ILayoutItem[]) => void;
	renderWidget: (type: IWidget["type"], title?: IWidget["title"]) => void;
	hasWidget: (type: IWidget["type"]) => boolean;
}

interface DashboardProviderProps {
	children: React.ReactNode;
	storageKey: string;
	availableWidgets: string[];
	initialWidgets?: IWidget[];
	initialLayouts?: ILayoutItem[];
}

const DashboardContext = createContext<DashboardContextType | undefined>(
	undefined,
);

export const DashboardProvider: React.FC<DashboardProviderProps> = ({
	children,
	storageKey,
	availableWidgets,
	initialWidgets = [],
	initialLayouts = [],
}) => {
	const [widgets, setWidgets] = $setting.useState<IWidget[]>(
		`dashboard.${storageKey}.widgets`,
		initialWidgets,
	);
	const [layouts, setLayouts] = $setting.useState<ILayoutItem[]>(
		`dashboard.${storageKey}.layouts`,
		initialLayouts,
	);

	const addWidget = (type: IWidget["type"], title?: IWidget["title"]) => {
		if (!availableWidgets.includes(type)) {
			return;
		}
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

	const renderWidget = (type: IWidget["type"], props: any) =>
		FactoryWidget.create(type, props);

	const hasWidget = (type: IWidget["type"]) =>
		Boolean(widgets.find((item) => item.type === type));

	const updateLayout = (newLayout: ILayoutItem[]) => {
		setLayouts(newLayout);
	};

	return (
		<DashboardContext.Provider
			value={{
				widgets,
				layouts,
				addWidget,
				removeWidget,
				updateLayout,
				renderWidget,
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

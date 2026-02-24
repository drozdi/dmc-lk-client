interface ILayoutItem {
	i: string;
	x: number;
	y: number;
	w: number;
	h: number;
	minW?: number;
	minH?: number;
}

interface IWidget {
	id?: ILayoutItem["i"];
	type: string;
	title?: string;
	params?: string[] | Record<string, any>;
	component?: React.ComponentType<any>;
	children?: React.ReactNode;
}

interface DashboardContextType {
	availableWidgets: IWidget[];
	widgets: IWidget[];
	layouts: ILayoutItem[];
	updateLayout: (newLayout: ILayoutItem[]) => void;
	addWidget: (widget: IWidget) => void;
	removeWidget: (widget: IWidget) => void;
	renderWidget: (widget: IWidget) => React.ReactNode;
	hasWidget: (type: IWidget["type"]) => boolean;
	registerWidget: (widget: IWidget) => void;
	clear: () => void
}

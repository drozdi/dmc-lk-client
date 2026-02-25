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
	id?: ILayoutItem["id"];
	type: string;
	fixed?: string;
	params?: string[] | Record<string, any>;
	component?: React.ComponentType<any>;
	children?: React.ReactNode;
}

interface DashboardContextType {
	widgets: IWidget[];
	layouts: ILayoutItem[];
	updateLayout: (newLayout: ILayoutItem[]) => void;
	addWidget: (widget: IWidget) => void;
	removeWidget: (widget: IWidget) => void;
	renderWidget: (widget: IWidget) => React.ReactNode;
	hasWidget: (type: IWidget["type"]) => boolean;
	registerWidget: (widget: IWidget) => void;
	clear: () => void;
	addShowed: (id: IWidget["id"]) => void;
	findWidget: (id: IWidget["id"]) => IWidget | undefined;
}

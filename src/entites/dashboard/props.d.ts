type ILayoutItem = (
	| {
			i: string;
	  }
	| {
			id: string;
	  }
) & {
	x: number;
	y: number;
	w: number;
	h: number;
	minW?: number;
	minH?: number;
};

interface IWidget {
	id?: ILayoutItem["i"] | ILayoutItem["id"];
	label?: string;
	description?: string;
	type: string;
	fixed?: string;
	params?: IWidgetParam[] | Record<string, any>;
	component?: React.ComponentType<any>;
	children?: React.ReactNode;
}

interface IWidgetParam {
	label?: string;
	field: string;
	type?: string;
	description?: string;
}

interface DashboardContextType {
	key: string;
	widgets: IWidget[];
	layouts: ILayoutItem[];
	showed: IWidget["id"][];
	availableWidgets: Record<IWidget["type"], IWidget>;
	updateLayout: (newLayout: ILayoutItem[]) => void;
	addWidget: (widget: IWidget) => void;
	removeWidget: (widget: IWidget) => void;
	renderWidget: (widget: IWidget) => React.ReactNode | undefined;
	hasWidget: (type: IWidget["type"]) => boolean;
	registerWidget: (widget: IWidget) => void;
	clear: () => void;
	addShowed: (id: IWidget["id"]) => void;
	findWidget: (id: IWidget["id"]) => IWidget | undefined;
}

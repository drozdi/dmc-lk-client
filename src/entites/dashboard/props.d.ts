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

interface IWidgetItem {
	id: ILayoutItem["i"] | ILayoutItem["id"];
	type: string;
	fixed?: boolean;
	params?: Record<string, any>;
}

interface IWidget {
	id?: IWidgetItem["id"];
	type: IWidgetItem["type"];
	label?: string;
	description?: string;
	params?: IWidgetParam[];
	component?: React.ComponentType<any>;
}

interface IWidgetParam {
	label?: string;
	field: string;
	type?: string;
	description?: string;
	required?: boolean;
}

interface DashboardContextType {
	key: string;
	widgets: IWidget[];
	layouts: ILayoutItem[];
	showed: IWidget["id"][];
	availableWidgets: Record<IWidget["type"], IWidget>;
	edit: boolean;
	toggleEdit: () => void;
	updateLayout: (newLayout: ILayoutItem[]) => void;
	addWidget: (widget: IWidget, layout?: Partial<ILayoutItem>) => void;
	removeWidget: (widget: IWidget) => void;
	renderWidget: (widget: IWidget) => React.ReactNode | undefined;
	hasWidget: (type: IWidget["type"]) => boolean;
	registerWidget: (widget: IWidget) => void;
	clear: () => void;
	addShowed: (id: IWidget["id"]) => void;
	findWidget: (id: IWidget["id"]) => IWidget | undefined;
}

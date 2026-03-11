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
	params?: {
		onRemove?: () => void;
		[key: string]: any;
	};
}

interface IWidget {
	type: IWidgetItem["type"];
	label: string;
	description?: string;
	params?: IWidgetParam[];
	component?: React.ComponentType<any>;
}

interface IWidgetParam {
	field: string;
	label?: string;
	type?: string;
	description?: string;
	required?: boolean;
	default?: any;
}

interface DashboardContextType {
	key: "i" | "id";
	widgets: IWidgetItem[];
	layouts: ILayoutItem[];
	availableWidgets: IWidget["type"][];
	edit: boolean;
	toggleEdit: () => void;
	updateLayout: (newLayout: ILayoutItem[]) => void;
	addWidget: (widget: IWidgetItem, layout?: Partial<ILayoutItem>) => void;
	removeWidget: (widget: IWidgetItem) => void;
	renderWidget: (widget: IWidgetItem) => React.ReactNode | undefined;
	findWidget: (id: IWidgetItem["id"]) => IWidgetItem | undefined;
	hasWidget: (type: IWidgetItem["type"]) => boolean;
	registerWidget: (widget: IWidget) => void;
	clear: () => void;
}

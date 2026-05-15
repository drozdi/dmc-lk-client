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
	defaultValue?: any;
}

interface WidgetContextType {
	key: "i" | "id";
	widgets: IWidgetItem[];
	layouts: ILayoutItem[];
	preview: Partial<ILayoutItem> | null;
	availableWidgets: IWidget["type"][];
	edit: boolean;
	id: IWidgetItem["id"];
	values: Record<string, any>;
	varibles: Record<
		string,
		{
			label: IWidgetParam["label"];
			type: IWidgetParam["type"];
			default: IWidgetParam["default"];
			required: IWidgetParam["required"];
		}
	>;
	getValue: (val: unknown) => any;
	setValue: (key: string, val: unknown) => void;
	toggleEdit: () => void;
	updateLayout: (newLayout: ILayoutItem[]) => void;
	addWidget: (widget: IWidgetItem, layout?: Partial<ILayoutItem>) => void;
	removeWidget: (widget: IWidgetItem) => void;
	renderWidget: (widget: IWidgetItem) => React.ReactNode | undefined;
	updateWidget: (widget: IWidgetItem, layout?: Partial<ILayoutItem>) => void;
	editWidget: (widget: IWidgetItem) => void;
	findWidget: (id: IWidgetItem["id"]) => IWidgetItem | undefined;
	hasWidget: (type: IWidgetItem["type"]) => boolean;
	registerWidget: (widget: IWidget) => void;
	clear: () => void;
	reset: () => void;
}

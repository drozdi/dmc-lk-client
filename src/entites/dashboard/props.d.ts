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

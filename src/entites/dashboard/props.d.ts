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
	params?: string[];
	component?: React.FC<any>;
	children?: React.ReactNode;
}

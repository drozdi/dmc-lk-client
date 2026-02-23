import { useDashboard } from "./context";

type DashBoardItemProps = {
	type: string;
	params?: IWidget["params"];
	children: React.ReactNode;
	[key: string]: any;
};
type DashBoardItemProps1 = Omit<DashBoardItemProps, "children"> & {
	component: React.FC<any>;
};

export function DashBoardItem({
	type,
	params,
	children,
	component,
	...props
}: DashBoardItemProps | DashBoardItemProps1) {
	const dashboard = useDashboard();
	dashboard?.registerWidget({
		type,
		params,
		children,
		component,
	});
	if (dashboard && !dashboard.hasWidget(type)) {
		return null;
	} else if (dashboard) {
		return dashboard.renderWidget(type, props);
	}
	return children;
}

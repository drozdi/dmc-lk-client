import { useDashboard } from "./context";

type DashBoardWidgetProps = {
	children: React.ReactNode;
	[key: string]: any;
};
type DashBoardWidgeComponentProps = Omit<DashBoardWidgetProps, "children"> & {
	type: IWidget["type"];
	params: IWidget["params"];
	component: IWidget["component"];
};

export function DashBoardWidget({
	children,
	type,
	params,
	component,
}: DashBoardWidgetProps | DashBoardWidgeComponentProps) {
	const dashboard = useDashboard();
	dashboard.registerWidget({
		type,
		params,
		children,
		component,
	});
	return null;
}

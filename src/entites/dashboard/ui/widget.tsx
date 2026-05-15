import { hyphenate } from "@/shared/utils";
import { WidgetProvider, useDashboard } from "../context";

interface DashBoardWidgetProps {
	widget: IWidgetItem["type"];
	fixed?: IWidgetItem["fixed"];
	[key: string]: any;
}

export function DashBoardWidget({
	id = "",
	widget,
	fixed,
	...params
}: DashBoardWidgetProps) {
	const dashboard = useDashboard();
	widget = hyphenate(widget);
	return (
		<WidgetProvider id={id} type={widget} fixed={fixed} params={params}>
			{dashboard.renderWidget({ id, type: widget, fixed, params })}
		</WidgetProvider>
	);
}

import { hyphenate } from "@/shared/utils";
import { WidgetItemProvider, useWidgets } from "../context";

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
	const dashboard = useWidgets();
	widget = hyphenate(widget);
	return (
		<WidgetItemProvider id={id} type={widget} fixed={fixed} params={params}>
			{dashboard.renderWidget({ id, type: widget, fixed, params })}
		</WidgetItemProvider>
	);
}

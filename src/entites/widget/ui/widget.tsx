import { hyphenate } from "@/shared/utils";
import { WidgetItemProvider, useWidgets } from "../context";

interface DashBoardWidgetProps {
	type: IWidgetItem["type"];
	fixed?: IWidgetItem["fixed"];
	[key: string]: any;
}

export function DashBoardWidget({
	id = "",
	type,
	fixed,
	...params
}: DashBoardWidgetProps) {
	const dashboard = useWidgets();
	type = hyphenate(type);
	return (
		<WidgetItemProvider id={id} type={type} fixed={fixed} params={params}>
			{dashboard.renderWidget({ id, type, fixed, params })}
		</WidgetItemProvider>
	);
}

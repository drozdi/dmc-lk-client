import { type GridItemProps } from "@dnd-grid/react";
import { useDashboard } from "./context";

type DashBoardItemProps<T = unknown> = GridItemProps<T> & {
	id?: IWidget["id"];
	children: React.ReactNode | string;
	fixed?: boolean;
	"data-grid"?: any;
};

type DashBoardItemParamsProps<T = unknown> = Omit<
	DashBoardItemProps<T>,
	"children"
> & {
	type: IWidget["type"];
	params: IWidget["params"];
};

export function DashBoardItem({
	id,
	fixed,
	type,
	params,
	children,
	...props
}: DashBoardItemProps<object> | DashBoardItemParamsProps<object>) {
	const dashboard = useDashboard();
	if (id) {
		// dashboard.addWidget({
		// 	id,
		// 	children,
		// 	fixed,
		// 	type,
		// 	params,
		// });
		return null;
	}
	return <div {...props}>{children}</div>;
}

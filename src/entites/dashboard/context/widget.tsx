import { useDashboard } from "./context";

type DashBoardItemProps = {
	id?: IWidget["id"];
	children: React.ReactNode;
	[key: string]: any;
};
type DashBoardItemProps1 = Omit<DashBoardItemProps, "children"> & {
	type: IWidget["type"];
	params: IWidget["params"];
	component?: IWidget["component"];
};

export function Widget({
	id,
	type,
	params,
	children,
	component,
	...props
}: DashBoardItemProps | DashBoardItemProps1) {
	const dashboard = useDashboard();
	if (id) {
		dashboard.addDefault({ type, id, params });
		return null;
	}

	// dashboard?.registerWidget({
	// 	type,
	// 	params,
	// 	children,
	// 	component,
	// });

	if (children && children.length > 1) {
		return <div {...props}>{children}</div>;
	} else if (dashboard && type) {
		return (
			<div {...props}>
				{dashboard.renderWidget({ type, params })}
				{children}
			</div>
		);
	}

	return <div {...props}>Unknown widget type: {type}</div>;
}

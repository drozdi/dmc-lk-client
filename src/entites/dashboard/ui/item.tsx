import { ActionIcon, HoverCard } from "@mantine/core";
import { Children } from "react";
import { TbX } from "react-icons/tb";
import { DashboardItemProvider, useDashboard } from "../context";

type DashBoardItemProps = (
	| {
			id: IWidgetItem["id"];
			children?: React.ReactNode;
	  }
	| {
			id?: IWidgetItem["id"];
			children: React.ReactNode;
	  }
) & {
	[key: string]: any;
};

export function DashBoardItem({ id, children }: DashBoardItemProps) {
	const dashboard = useDashboard();
	const widget = dashboard.findWidget(id);

	if (widget) {
		console.log(widget, dashboard.edit);
		console.log(dashboard.renderWidget(widget));
		return (
			<DashboardItemProvider {...widget}>
				<HoverCard disabled={!dashboard.edit} position="top-end" offset={0}>
					<HoverCard.Target>
						{Children.only(children || dashboard.renderWidget(widget))}
					</HoverCard.Target>
					<HoverCard.Dropdown>
						<ActionIcon
							color="red"
							onClick={() => dashboard.removeWidget(widget)}
						>
							<TbX />
						</ActionIcon>
					</HoverCard.Dropdown>
				</HoverCard>
			</DashboardItemProvider>
		);
	}
	return children;
}

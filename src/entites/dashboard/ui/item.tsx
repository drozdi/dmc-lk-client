import { ActionIcon, HoverCard, Tooltip } from "@mantine/core";
import { Children } from "react";
import { TbX } from "react-icons/tb";
import { WidgetItemProvider, useWidgets } from "../context";

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
	const dashboard = useWidgets();
	const widget = dashboard.findWidget(id);

	if (widget) {
		return (
			<WidgetItemProvider {...widget}>
				<HoverCard disabled={!dashboard.edit} position="top-end" offset={0}>
					<HoverCard.Target>
						{Children.only(children || dashboard.renderWidget(widget))}
					</HoverCard.Target>
					<HoverCard.Dropdown p="xs">
						<Tooltip label="Удалить">
							<ActionIcon
								color="red"
								onClick={() => dashboard.removeWidget(widget)}
							>
								<TbX />
							</ActionIcon>
						</Tooltip>
					</HoverCard.Dropdown>
				</HoverCard>
			</WidgetItemProvider>
		);
	}
	return children;
}

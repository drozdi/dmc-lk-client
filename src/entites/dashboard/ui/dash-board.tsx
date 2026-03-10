import { Children, useMemo } from "react";
import {
	ReactGridLayout,
	useContainerWidth,
	type Layout,
} from "react-grid-layout";
import { GridBackground } from "react-grid-layout/extras";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useDashboard } from "../context";

interface UiDashBoardProps {
	children: React.ReactNode;
}

export function UiDashBoard({ children }: UiDashBoardProps) {
	const { width, containerRef, mounted } = useContainerWidth();
	const { layouts, updateLayout, widgets, renderWidget, edit, key } =
		useDashboard();

	const layouts_ = useMemo(() => {
		if (edit) {
			return layouts.map((item) => ({
				...item,
				static: false,
				isDraggable: true,
				isResizable: true,
			}));
		}
		return layouts.map((layout) => {
			let widget = widgets.find((item) => item.id === layout[key]);
			if (widget?.fixed) {
				return {
					...layout,
					static: true,
					isDraggable: false,
					isResizable: false,
				};
			}
			return {
				...layout,
				static: false,
				isDraggable: true,
				isResizable: true,
			};
		});
	}, [layouts, widgets, edit]);

	return (
		<div ref={containerRef} style={{ position: "relative" }}>
			{mounted && (
				<>
					{Children.map(children, (child) => {
						return child?.key ? null : child;
					})}
					{import.meta.env.DEV && (
						<GridBackground
							width={width}
							cols={12}
							rowHeight={60}
							margin={[10, 10]}
							rows={24}
							color="#f0f0f0"
							borderRadius={4}
						/>
					)}
					<ReactGridLayout
						layout={layouts_ as Layout}
						width={width}
						gridConfig={{ cols: 12, rowHeight: 60 }}
						onLayoutChange={(layout) => {
							updateLayout(layout as ILayoutItem[]);
						}}
						dragConfig={{
							handle: ".drag-handle",
						}}
					>
						{Children.map(children, (child) => {
							return child?.key ? child : null;
						})}
						{widgets.map((widget) => (
							<div key={widget.id}>{renderWidget(widget, edit)}</div>
						))}
						{/* {edit && (
							<div
								key=".new"
								data-grid={{
									x: 0,
									y: Infinity,
									w: 1,
									h: 1,
								}}
							>
								<Center w="100%" h="100%" c="red" fz="h1">
									<TbCirclePlus />
								</Center>
							</div>
						)} */}
					</ReactGridLayout>
				</>
			)}
		</div>
	);
}

import { Children } from "react";
import { ReactGridLayout, useContainerWidth } from "react-grid-layout";
import { GridBackground } from "react-grid-layout/extras";

import "@dnd-grid/react/styles.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useDashboard } from "../context";

interface UiDashBoardProps {
	children: React.ReactNode;
}

export function UiDashBoard({ children }: UiDashBoardProps) {
	const { width, containerRef, mounted } = useContainerWidth();
	const { layouts, updateLayout, widgets, renderWidget } = useDashboard();
	return (
		<div ref={containerRef} style={{ position: "relative" }}>
			{mounted && (
				<>
					{Children.map(children, (child) => {
						return child.key ? null : child;
					})}
					<GridBackground
						width={width}
						cols={12}
						rowHeight={60}
						margin={[10, 10]}
						rows={24}
						color="#f0f0f0"
						borderRadius={4}
					/>
					<ReactGridLayout
						layout={layouts}
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
							return child.key ? child : null;
						})}
						{widgets.map((widget) => (
							<div key={widget.id}>{renderWidget(widget)}</div>
						))}
					</ReactGridLayout>
				</>
			)}
		</div>
	);
}

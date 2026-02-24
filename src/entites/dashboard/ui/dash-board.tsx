import { ReactGridLayout, useContainerWidth } from "react-grid-layout";
import { GridBackground } from "react-grid-layout/extras";

import "@dnd-grid/react/styles.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useDashboard } from "../context";

interface UiDashBoardProps {
	children: React.ReactNode;
}

import { DndGrid, verticalCompactor } from "@dnd-grid/react";

export function UiDashBoard({ children }: UiDashBoardProps) {
	const { width, containerRef, mounted } = useContainerWidth();
	const { layouts, updateLayout, widgets, renderWidget } = useDashboard();

	return (
		<DndGrid
			layout={layouts}
			cols={12}
			rowHeight={100}
			onLayoutChange={(layout) => {
				updateLayout(layout as ILayoutItem[]);
			}}
			compactor={verticalCompactor}
			dragHandle=".mantine-Text-root"
		>
			{children}
		</DndGrid>
	);

	return (
		<div ref={containerRef} style={{ position: "relative" }}>
			{mounted && (
				<>
					<GridBackground
						width={width}
						cols={12}
						rowHeight={60}
						margin={[10, 10]}
						rows={10}
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
					>
						{children}
						{widgets.map((widget) => (
							<div key={widget.id}>{renderWidget(widget)}</div>
						))}
					</ReactGridLayout>
				</>
			)}
		</div>
	);
}

import { ReactGridLayout, useContainerWidth } from "react-grid-layout";
import { GridBackground } from "react-grid-layout/extras";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useDashboard } from "../context";

interface UiDashBoardProps {
	children: React.ReactNode;
}

export function UiDashBoard({ children }: UiDashBoardProps) {
	const { width, containerRef, mounted } = useContainerWidth();
	const { layouts, updateLayout } = useDashboard();

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
					</ReactGridLayout>
				</>
			)}
		</div>
	);
}

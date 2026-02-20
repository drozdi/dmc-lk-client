import { ReactGridLayout, useContainerWidth } from "react-grid-layout";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useDashboard } from "../utils";

export function DashBoardProvider({ children, name }) {
	const { width, containerRef, mounted } = useContainerWidth();
	const { layouts, updateLayout } = useDashboard();

	return (
		<div ref={containerRef}>
			{mounted && (
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
			)}
		</div>
	);
}

import "@dnd-grid/react/styles.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useDashboard } from "../context";

interface UiDashBoardProps {
	children: React.ReactNode;
}

import { Children } from "react";

import { GridItem, useContainerWidth, useDndGrid } from "@dnd-grid/react";

export function DashBoardUi({ children }: UiDashBoardProps) {
	const { width, containerRef, mounted } = useContainerWidth();
	const { layouts, updateLayout, widgets, renderWidget } = useDashboard();

	const { gridProps, itemProps, liveRegionElement } = useDndGrid({
		layout: layouts,
		cols: 12,
		rowHeight: 100,
		width: width,
		onLayoutChange: (layout) => {
			updateLayout(layout as ILayoutItem[]);
		},
	});

	const droppingItemProps = itemProps.getDroppingItemProps();
	const placeholderProps = itemProps.getPlaceholderProps();

	return (
		<div ref={containerRef} style={{ width: "100%", position: "relative" }}>
			{mounted && (
				<div {...gridProps}>
					{liveRegionElement}
					{Children.map(children, (child) => {
						const props = itemProps.getItemProps(child);
						return props ? <GridItem {...props} /> : null;
					})}
					{droppingItemProps && <GridItem {...droppingItemProps} />}
					{placeholderProps && <GridItem {...placeholderProps} />}
				</div>
			)}
		</div>
	);

	return (
		<div ref={containerRef} style={{ width: "100%", position: "relative" }}>
			{mounted && (
				<div {...gridProps}>
					{liveRegionElement}
					{children}
					{droppingItemProps && <GridItem {...droppingItemProps} />}
					{placeholderProps && <GridItem {...placeholderProps} />}
				</div>
			)}
		</div>
	);
}

import { Center, useMantineColorScheme } from "@mantine/core";
import { Children, useCallback, useMemo, useRef, useState } from "react";
import {
	ReactGridLayout,
	useContainerWidth,
	type Layout,
} from "react-grid-layout";
import { GridBackground } from "react-grid-layout/extras";
import { TbCirclePlus } from "react-icons/tb";
import { useDashboard } from "../context";
import { DashBoardItem } from "./item";

interface UiDashBoardProps {
	children: React.ReactNode;
	onSelection?: (react: Partial<ILayoutItem>) => void;
}

export function UiDashBoard({ children, onSelection }: UiDashBoardProps) {
	const { colorScheme } = useMantineColorScheme();
	const [isSelecting, setIsSelecting] = useState(false);
	const [selectionStart, setSelectionStart] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const [selectionEnd, setSelectionEnd] = useState<{
		x: number;
		y: number;
	} | null>(null);

	const gridPropsRef = useRef<{
		cols: number;
		rowHeight: number;
		margin: [number, number];
	}>({
		cols: 12,
		rowHeight: 60,
		margin: [10, 10],
	});
	const { width, containerRef, mounted } = useContainerWidth();
	
	const { layouts, updateLayout, widgets, edit, key, preview } = useDashboard();

	const isPreview = preview && Object.keys(preview).length > 0;

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

	// Проверка, занята ли ячейка (или область) существующим виджетом
	const isCellFree = (x: number, y: number) => {
		return !layouts.some((item) => {
			return (
				x >= item.x && x < item.x + item.w && y >= item.y && y < item.y + item.h
			);
		});
	};

	const getCellFromMouseEvent = useCallback((e: MouseEvent) => {
		if (!containerRef.current) {
			return null;
		}

		const rect = containerRef.current.getBoundingClientRect();
		const { cols, rowHeight, margin } = gridPropsRef.current;

		const containerWidth = rect.width;
		const colWidth = (containerWidth - (cols + 1) * margin[0]) / cols;

		const relativeX = e.clientX - rect.left;
		const relativeY = e.clientY - rect.top;

		let x = Math.floor(relativeX / (colWidth + margin[0]));
		let y = Math.floor(relativeY / (rowHeight + margin[1]));

		x = Math.min(x, cols - 1);
		y = Math.max(y, 0);

		if (x >= 0 && x < cols) {
			return { x, y };
		}
		return null;
	}, []);

	const isAreaFree = (x: number, y: number, w: number, h: number) => {
		for (let dx = 0; dx < w; dx++) {
			for (let dy = 0; dy < h; dy++) {
				if (!isCellFree(x + dx, y + dy)) {
					return false;
				}
			}
		}
		return true;
	};

	const handleMouseDown = (e: MouseEvent) => {
		// Если клик на виджете — не начинаем выделение, пусть RGL работает
		if ((e.target as HTMLElement).closest(".react-grid-item") || !edit) {
			return;
		}

		const cell = getCellFromMouseEvent(e);
		if (cell && isCellFree(cell.x, cell.y)) {
			setIsSelecting(true);
			setSelectionStart(cell);
			setSelectionEnd(cell);
		}
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!isSelecting || !selectionStart) {
			return;
		}
		const cell = getCellFromMouseEvent(e);
		if (!cell) {
			return;
		}

		const x1 = Math.min(selectionStart.x, cell.x);
		const y1 = Math.min(selectionStart.y, cell.y);
		const x2 = Math.max(selectionStart.x, cell.x);
		const y2 = Math.max(selectionStart.y, cell.y);

		const w = x2 - x1 + 1;
		const h = y2 - y1 + 1;

		if (cell && isAreaFree(x1, y1, w, h)) {
			setSelectionEnd(cell);
		}
	};

	const handleMouseUp = () => {
		if (isSelecting && selectionStart && selectionEnd) {
			const x1 = Math.min(selectionStart.x, selectionEnd.x);
			const y1 = Math.min(selectionStart.y, selectionEnd.y);
			const x2 = Math.max(selectionStart.x, selectionEnd.x);
			const y2 = Math.max(selectionStart.y, selectionEnd.y);

			const width = x2 - x1 + 1;
			const height = y2 - y1 + 1;

			if (isAreaFree(x1, y1, width, height)) {
				onSelection?.({ x: x1, y: y1, w: width, h: height });
			}
		}

		setIsSelecting(false);
		setSelectionStart(null);
		setSelectionEnd(null);
	};

	const handleMouseLeave = () => {
		handleMouseUp();
	};

	const getSelectionStyle = () => {
		if (
			!isSelecting ||
			!selectionStart ||
			!selectionEnd ||
			!containerRef.current
		) {
			if (isPreview) {
				return _getSelectionStyle(preview as ILayoutItem);
			}
			return {};
		}

		const x1 = Math.min(selectionStart.x, selectionEnd.x);
		const y1 = Math.min(selectionStart.y, selectionEnd.y);
		const x2 = Math.max(selectionStart.x, selectionEnd.x);
		const y2 = Math.max(selectionStart.y, selectionEnd.y);

		return _getSelectionStyle({
			x: x1,
			y: y1,
			w: x2 - x1 + 1,
			h: y2 - y1 + 1,
		} as ILayoutItem);
	};

	const _getSelectionStyle = ({ x, y, w, h }: ILayoutItem) => {
		const containerWidth = containerRef.current?.getBoundingClientRect()
			.width as number;
		const { cols, rowHeight, margin } = gridPropsRef.current;
		const colWidth = (containerWidth - (cols + 1) * margin[0]) / cols;
		return {
			position: "absolute",
			left: `${x * colWidth + (x + 1) * margin[0]}px`,
			top: `${y * rowHeight + (y + 1) * margin[1]}px`,
			width: `${colWidth * w + (w - 1) * margin[0]}px`,
			height: `${h * rowHeight + (h - 1) * margin[1]}px`,
			backgroundColor: "rgba(0, 120, 255, 0.2)",
			border: "2px solid #0078ff",
			borderRadius: "4px",
			pointerEvents: "none",
			zIndex: 10,
			transition: "none",
		};
	};

	const maxRows = useMemo(
		() => Math.max(...layouts.map((l) => l.y + l.h)),
		[layouts],
	);

	return (
		<div
			ref={containerRef}
			style={{ position: "relative", userSelect: "none" }}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseLeave}
		>
			{mounted && (
				<>
					{Children.map(children, (child) => {
						return child?.key ? null : child;
					})}
					{edit && (
						<GridBackground
							width={width}
							rows={maxRows}
							{...gridPropsRef.current}
							color={
								colorScheme === "dark"
									? "var(--mantine-color-dark-4)"
									: "var(--mantine-color-blue-1)"
							}
							borderRadius={4}
						/>
					)}
					<ReactGridLayout
						layout={layouts_ as Layout}
						width={width}
						gridConfig={gridPropsRef.current}
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
							<div key={widget.id}>
								<DashBoardItem id={widget.id} />
							</div>
						))}
					</ReactGridLayout>
				</>
			)}
			{((isSelecting && edit) || isPreview) && (
				<div style={getSelectionStyle()}>
					<Center w="100%" h="100%" c="red" fz="h1">
						<TbCirclePlus />
					</Center>
				</div>
			)}
		</div>
	);
}

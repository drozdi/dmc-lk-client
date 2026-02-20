import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cloneElement } from "react";

interface DashBoardItemProps {
	children: React.ReactNode;
	id: string;
}

export function DashBoardItem({ children, id }: DashBoardItemProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
		cursor: "grab",
	};
	return cloneElement(children, {
		...attributes,
		...listeners,
		ref: setNodeRef,
		style,
	});
}

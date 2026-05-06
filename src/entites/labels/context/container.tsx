import {
	useDroppable
} from '@dnd-kit/core';
import { Children, cloneElement } from "react";

export interface GroupedContainerProps {
	id: string;
  children: React.ReactNode;
	color?: string;
}

export function GroupedContainer({ id, children, color= "#fa8e007c" }: GroupedContainerProps) {
	const { setNodeRef, isOver } = useDroppable({ id });
	return cloneElement(Children.only(children), {
		ref: setNodeRef,
		bg: isOver ? color : "",
		style: {
			overflow: 'visible',
		}
	});
}

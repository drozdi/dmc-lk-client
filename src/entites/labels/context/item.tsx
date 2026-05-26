import {
	useDraggable
} from '@dnd-kit/core';
import { Children, cloneElement } from "react";

export interface GroupedItemProps {
	id: string;
	children: React.ReactElement;
}

export function GroupedItem({ children, id, ...data }: GroupedItemProps) {
	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
		id, data
	});
	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
				opacity: isDragging ? 0.8 : 1,
				[`--cursor`]: isDragging ? 'grabbing' : 'grab',
			}
		: {
				opacity: isDragging ? 0.8 : 1,
				[`--cursor`]: isDragging ? 'grabbing' : 'grab',
			};
		
	return cloneElement(Children.only(children), {
		ref: setNodeRef,
		style: style,
		...listeners,
		...attributes,
	});
}

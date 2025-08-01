import { useDraggable } from '@dnd-kit/react'
import { Children, cloneElement } from 'react'

interface ItemProps {
	id: string | number
	data: Record<string, any>
	children: React.ReactNode
}

export function GroupItem({ children, id, data, ...props }: ItemProps) {
	const { ref, isDragging } = useDraggable({
		id,
		type: 'item',
		data,
	})
	Children.only(children)
	return cloneElement(children, {
		...props,
		className: '!cursor-move',
		ref,
		'data-dragging': isDragging,
	})
}

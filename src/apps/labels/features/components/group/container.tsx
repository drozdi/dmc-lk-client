import { CollisionPriority } from '@dnd-kit/abstract'
import { useDroppable } from '@dnd-kit/react'
import { Children, cloneElement } from 'react'
interface ContainerProps {
	column: string
	children: React.ReactNode
	hover?: string
	color?: string
}

export function GroupContainer({
	column,
	children,
	hover = '#00000030',
	color = '#fa8e007c',
	...props
}: ContainerProps) {
	const { isDropTarget, ref } = useDroppable({
		id: column,
		type: 'column',
		accept: ['item', 'column'],
		collisionPriority: CollisionPriority.Low,
	})
	const style = isDropTarget ? { background: hover } : { background: color }
	Children.only(children)
	return cloneElement(children, {
		...props,
		style,
		ref,
	})
}

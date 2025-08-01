import { CollisionPriority } from '@dnd-kit/abstract'
import { useDroppable } from '@dnd-kit/react'
import { Children, cloneElement } from 'react'
interface ContainerProps {
	column: string
	children: React.ReactNode
}

export function GroupContainer({ column, children, ...props }: ContainerProps) {
	const { isDropTarget, ref } = useDroppable({
		id: column,
		type: 'column',
		accept: ['item', 'column'],
		collisionPriority: CollisionPriority.Low,
	})
	const style = isDropTarget ? { background: '#00000030' } : undefined
	Children.only(children)
	return cloneElement(children, {
		...props,
		style,
		ref,
	})
}

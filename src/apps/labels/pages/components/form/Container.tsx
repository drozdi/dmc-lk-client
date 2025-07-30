import { CollisionPriority } from '@dnd-kit/abstract'
import { useDroppable } from '@dnd-kit/react'
interface ContainerProps {
	className?: string
	column: string
	children: React.ReactNode
}

export function Container({ className, column, children }: ContainerProps) {
	const { isDropTarget, ref } = useDroppable({
		id: column,
		type: 'column',
		accept: ['item', 'column'],
		collisionPriority: CollisionPriority.Low,
	})
	const style = isDropTarget ? { background: '#00000030' } : undefined

	return (
		<div className={className} ref={ref} style={style}>
			{children}
		</div>
	)
}

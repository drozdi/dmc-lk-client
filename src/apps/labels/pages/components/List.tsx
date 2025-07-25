import { CollisionPriority } from '@dnd-kit/abstract'
import { useDroppable } from '@dnd-kit/react'
import React from 'react'
import { DmcList } from '../../../../shared/ui'

interface ListProps {
	children: React.ReactNode
	id: string
	className?: string
}

export function List({ children, id, className }: ListProps) {
	const { isDropTarget, ref } = useDroppable({
		id,
		type: 'column',
		accept: ['item', 'column'],
		collisionPriority: CollisionPriority.Low,
	})
	const style = isDropTarget ? { background: '#00000030' } : undefined

	return (
		<DmcList className={className} ref={ref} style={style}>
			{children}
		</DmcList>
	)
}

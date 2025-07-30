import { useDraggable } from '@dnd-kit/react'
import { TbList } from 'react-icons/tb'
import { DmcItem, DmcItemLabel, DmcItemSection } from '../../../../../shared/ui'

interface ItemProps {
	id: string
	data: Record<string, any>
}

export function Item({ id, data }: ItemProps) {
	const { ref, isDragging } = useDraggable({
		id,
		type: 'item',
		data,
	})

	return (
		<DmcItem className='cursor-move' ref={ref} data-dragging={isDragging}>
			<DmcItemSection side>
				<TbList />
			</DmcItemSection>
			<DmcItemSection>
				<DmcItemLabel>{id}</DmcItemLabel>
			</DmcItemSection>
		</DmcItem>
	)
}

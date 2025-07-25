import { useSortable } from '@dnd-kit/react/sortable'
import { DmcItem, DmcItemLabel, DmcItemSection } from '../../../../shared/ui'

interface ItemProps {
	id: string
	index: number
	column: string
	data: Record<string, any>
}

export function Item({ id, index, column, data }: ItemProps) {
	const { ref, isDragging } = useSortable({
		id,
		index,
		type: 'item',
		accept: 'item',
		group: column,
		data,
	})

	return (
		<DmcItem ref={ref} data-dragging={isDragging}>
			<DmcItemSection>
				<DmcItemLabel>{id}</DmcItemLabel>
			</DmcItemSection>
		</DmcItem>
	)
}

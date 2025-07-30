import { DmcList } from '../../../../../shared/ui'
import { Item } from './Item'

interface ListProps {
	items: any[]
	className?: string
}

export function List({ items, className }: ListProps) {
	return (
		<DmcList className={className}>
			{(items || []).map(item => (
				<Item key={item.id} id={item.id} data={item} />
			))}
		</DmcList>
	)
}

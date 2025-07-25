import { Item } from './Item'
import { List } from './List'

interface ContainerProps {
	className?: string
	column: string
	items: any[]
}

export function Container({ className, column, items }: ContainerProps) {
	return (
		<List className={className} id={column}>
			{items.map((item, index) => (
				<Item
					key={item.id}
					id={item.id}
					index={index}
					column={column}
					data={item}
				/>
			))}
		</List>
	)
}

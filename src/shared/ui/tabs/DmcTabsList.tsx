import { cls } from '../../utils'
import './styles.css'

interface DmcTabsListProps {
	className?: string
	children?: React.ReactNode
	justify?: 'start' | 'center' | 'between' | 'end'
	grow?: boolean
	noWrap?: boolean
}
export function DmcTabsList({
	className,
	children,
	justify,
	grow,
	noWrap,
}: DmcTabsListProps) {
	return (
		<div
			role='tablist'
			className={cls(
				'dmc-tabs-list',
				{
					'dmc-tabs-list--no-wrap': noWrap,
					'dmc-tabs-list--grow': grow,
					[`justify-${justify}`]: justify,
				},
				className
			)}
		>
			{children}
		</div>
	)
}

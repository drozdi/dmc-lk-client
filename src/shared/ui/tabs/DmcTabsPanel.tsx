import { cls } from '../../utils'
import { useDmcTabsContext } from './DmcTabsContext'
import './styles.css'

interface TabsPanelProps {
	className?: string
	children?: React.ReactNode
	value: string
	keepMounted?: boolean
}

export function DmcTabsPanel({
	className,
	children,
	value,
	keepMounted,
	...props
}: TabsPanelProps) {
	const ctx = useDmcTabsContext()
	const active = ctx.isActive(value)
	const content =
		ctx.keepMounted || keepMounted ? children : active ? children : null
	return (
		<div
			{...props}
			className={cls(
				'dmc-tabs-panel',
				{
					'dmc-tabs-panel--active': active,
				},
				className
			)}
			role='tabpanel'
			id={ctx.getPanelId(value)}
			aria-labelledby={ctx.getTabId(value)}
			aria-hidden={!active}
		>
			{content}
		</div>
	)
}

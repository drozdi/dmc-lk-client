import { Sections } from '../../internal/sections'
import { cls } from '../../utils'
import { useDmcTabsContext } from './DmcTabsContext'
import './styles.css'

interface TabsTabProps {
	className?: string
	children?: React.ReactNode
	value: string
	color?: string
	disabled?: boolean
	tabIndex?: number
	onClick?: (event: React.MouseEvent) => void
}

export function DmcTabsTab({
	className,
	children,
	value,
	color,
	disabled,
	tabIndex = 0,
	onClick,
	...props
}: TabsTabProps) {
	const ctx = useDmcTabsContext()
	const active = ctx.isActive(value)
	const handleClick = (event: React.MouseEvent) => {
		event.preventDefault()
		if (disabled) {
			return
		}
		event.value = value
		onClick?.(event)
		ctx.onActiveTab(value)
	}

	return (
		<Sections
			as='button'
			{...props}
			role='tab'
			id={ctx.getTabId(value)}
			aria-selected={active}
			aria-disabled={disabled}
			aria-controls={ctx.getPanelId(value)}
			disabled={disabled}
			tabIndex={disabled ? -1 : tabIndex}
			className={cls(
				'dmc-tabs-tab',
				{
					'dmc-tabs-tab--disabled': disabled,
					'dmc-tabs-tab--active': active,
					[`text-${color}`]: color,
				},
				className
			)}
			classBody='dmc-tabs-tab__label'
			onClick={handleClick}
			onKeyDown={ctx.onKeyDown}
		>
			{children}
		</Sections>
	)
}

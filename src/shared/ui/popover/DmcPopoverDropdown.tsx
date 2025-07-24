import { memo } from 'react'
import { cls } from '../../utils'
import { usePopover } from './DmcPopoverContext'
import './style.css'

interface PopoverDropdownProps {
	children: React.ReactNode
}

export const DmcPopoverDropdown = memo(({ children }: PopoverDropdownProps) => {
	const { opened, position } = usePopover()
	return (
		<div
			className={cls('dmc-popover__dropdown', {
				[`dmc--popover__dropdown--${position}`]: position,
				'dmc-popover__dropdown--open': opened,
			})}
		>
			{children}
		</div>
	)
})

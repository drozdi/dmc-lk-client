import { memo } from 'react'
import { cls } from '../../utils'
import { useDmcPopover } from './DmcPopoverContext'
import './style.css'

interface PopoverDropdownProps {
	children: React.ReactNode
	className?: string
}

export const DmcPopoverDropdown = memo(
	({ children, className }: PopoverDropdownProps) => {
		const { opened, position } = useDmcPopover()
		return (
			<div
				className={cls(
					'dmc-popover__dropdown',
					{
						[`dmc-popover__dropdown--${position}`]: position,
						'dmc-popover__dropdown--open': opened,
					},
					className
				)}
			>
				{children}
			</div>
		)
	}
)

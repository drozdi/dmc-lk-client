import { memo } from 'react'
import { cls } from '../../utils'
import { usePopover } from './PopoverContext'
import './style.css'

interface PopoverDropdownProps {
	children: React.ReactNode
}

export const PopoverDropdown = memo(({ children }: PopoverDropdownProps) => {
	const { opened, position } = usePopover()
	return (
		<div
			className={cls('mdc-popover__dropdown', {
				[`mdc--popover__dropdown--${position}`]: position,
				'mdc-popover__dropdown--open': opened,
			})}
		>
			{children}
		</div>
	)
})

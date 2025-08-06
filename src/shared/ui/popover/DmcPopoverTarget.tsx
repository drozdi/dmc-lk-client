import { Children, cloneElement, memo } from 'react'
import { useDmcPopover } from './DmcPopoverContext'
import './style.css'

interface PopoverTargetProps {
	children: React.ReactElement
}

export const DmcPopoverTarget = memo(({ children }: PopoverTargetProps) => {
	const ctx = useDmcPopover()
	return cloneElement(Children.only(children), {
		onClick: (event: React.MouseEvent) => {
			ctx.onToggle(event)
			;(children.props as any).onClick?.(event)
		},
	})
})

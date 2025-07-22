import { Children, cloneElement, memo } from 'react'
import { usePopover } from './PopoverContext'
import './style.css'

interface PopoverTargetProps {
	children: React.ReactElement
}

export const PopoverTarget = memo(({ children }: PopoverTargetProps) => {
	const ctx = usePopover()
	return cloneElement(Children.only(children), {
		onClick: (event: React.MouseEvent) => {
			ctx.onToggle(event)
			;(children.props as any).onClick?.(event)
		},
	})
})

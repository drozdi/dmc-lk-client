import React, { useEffect, useMemo } from 'react'
import { useDisclosure } from '../../hooks'
import { cls } from '../../utils/'
import { DmcPopoverProvider } from './DmcPopoverContext'
import { DmcPopoverDropdown } from './DmcPopoverDropdown'
import { DmcPopoverTarget } from './DmcPopoverTarget'
import './style.css'

interface PopoverProps {
	as?: React.ElementType
	position: 'top' | 'bottom' | 'left' | 'right'
	className?: string
	disabled?: boolean
	children: React.ReactNode
	autoClose?: boolean
	onOpen?: (event?: React.MouseEvent) => void
	onClose?: (event?: React.MouseEvent) => void
}
export const DmcPopover = ({
	as = 'div',
	position = 'top',
	disabled,
	children,
	onOpen,
	onClose,
	autoClose,
	className,
	...props
}: PopoverProps) => {
	const Tag = as
	const [opened, { open, close, toggle }] = useDisclosure(false, {
		onOpen,
		onClose,
	})

	const context = useMemo(
		() => ({
			position,
			opened,
			onOpen: open,
			onClose: close,
			onToggle: toggle,
		}),
		[opened, position]
	)

	//useImperativeHandle(ref, () => context, [context])

	useEffect(() => {
		const closeHandler = (event: MouseEvent) => {
			if (
				event.target instanceof HTMLElement &&
				!event.target.closest('.dmc-popover')
			) {
				close()
			}
		}
		document.addEventListener('click', closeHandler)
		return () => {
			document.removeEventListener('click', closeHandler)
		}
	}, [autoClose])

	return (
		<DmcPopoverProvider value={context}>
			<Tag {...props} className={cls('dmc-popover', className)}>
				{children}
			</Tag>
		</DmcPopoverProvider>
	)
}

DmcPopover.Target = DmcPopoverTarget
DmcPopover.Dropdown = DmcPopoverDropdown

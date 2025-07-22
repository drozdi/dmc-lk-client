import React, { useEffect, useMemo } from 'react'
import { useDisclosure } from '../../hooks'
import { PopoverProvider } from './PopoverContext'
import { PopoverDropdown } from './PopoverDropdown'
import { PopoverTarget } from './PopoverTarget'
import './style.css'

interface PopoverProps {
	as?: React.ElementType
	position: 'top' | 'bottom' | 'left' | 'right'
	disabled?: boolean
	children: React.ReactNode
	autoClose?: boolean
	onOpen?: (event?: React.MouseEvent) => void
	onClose?: (event?: React.MouseEvent) => void
}
export const Popover = ({
	as = 'div',
	position = 'top',
	disabled,
	children,
	onOpen,
	onClose,
	autoClose,
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
				!event.target.closest('.mdc-popover')
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
		<PopoverProvider value={context}>
			<Tag {...props} className='mdc-popover'>
				{children}
			</Tag>
		</PopoverProvider>
	)
}

Popover.Target = PopoverTarget
Popover.Dropdown = PopoverDropdown

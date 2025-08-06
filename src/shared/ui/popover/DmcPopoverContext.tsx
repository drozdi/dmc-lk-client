import { createSafeContext } from '../../internal/utils'

interface IPopoverContext {
	position: 'top' | 'bottom' | 'left' | 'right'
	opened: boolean
	onOpen?: (event?: React.MouseEvent) => void
	onClose?: (event?: React.MouseEvent) => void
	onToggle: (event?: React.MouseEvent) => void
}

export const [DmcPopoverProvider, useDmcPopover] =
	createSafeContext<IPopoverContext>(
		'Popover component was not found in the tree'
	)

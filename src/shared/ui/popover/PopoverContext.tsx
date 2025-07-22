import { createContext, useContext } from 'react'

interface IPopoverContext {
	position: 'top' | 'bottom' | 'left' | 'right'
	opened: boolean
	onOpen?: (event?: React.MouseEvent) => void
	onClose?: (event?: React.MouseEvent) => void
	onToggle: (event?: React.MouseEvent) => void
}

const PopoverContext = createContext<IPopoverContext | null>(null)

export const PopoverProvider = ({
	value,
	children,
}: {
	value: IPopoverContext
	children: React.ReactNode
}) => {
	return (
		<PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>
	)
}

export const usePopover = (): IPopoverContext => {
	const context = useContext(PopoverContext)
	if (context === null) {
		throw new Error('Popover component was not found in the tree')
	}
	return context
}

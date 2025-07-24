import { createContext, useContext } from 'react'

interface IPopoverContext {
	position: 'top' | 'bottom' | 'left' | 'right'
	opened: boolean
	onOpen?: (event?: React.MouseEvent) => void
	onClose?: (event?: React.MouseEvent) => void
	onToggle: (event?: React.MouseEvent) => void
}

const DmcPopoverContext = createContext<IPopoverContext | null>(null)

export const DmcPopoverProvider = ({
	value,
	children,
}: {
	value: IPopoverContext
	children: React.ReactNode
}) => {
	return (
		<DmcPopoverContext.Provider value={value}>
			{children}
		</DmcPopoverContext.Provider>
	)
}

export const useDmcPopover = (): IPopoverContext => {
	const context = useContext(DmcPopoverContext)
	if (context === null) {
		throw new Error('Popover component was not found in the tree')
	}
	return context
}

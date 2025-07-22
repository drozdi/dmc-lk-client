import { createContext, useContext } from 'react'

interface IBtnGroupContext {
	btnProps: Record<string, any>
	switchable: boolean
	selectable: boolean
	multiple: boolean
	value: any
	onChange: any
	isDisabled: (value: any) => boolean
	isActive: (value: any) => boolean
}

const BtnGroupContext = createContext<IBtnGroupContext | null>(null)

export const BtnGroupProvider = ({
	value,
	children,
}: {
	value: IBtnGroupContext
	children: React.ReactNode
}) => {
	return (
		<BtnGroupContext.Provider value={value}>
			{children}
		</BtnGroupContext.Provider>
	)
}

export const useBtnGroupContext = (): IBtnGroupContext => {
	const context = useContext(BtnGroupContext)
	if (context === null) {
		throw new Error('Popover component was not found in the tree')
	}
	return context
}

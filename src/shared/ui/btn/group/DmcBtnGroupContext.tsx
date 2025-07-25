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

const DmcBtnGroupContext = createContext<IBtnGroupContext | null>(null)

export const DmcBtnGroupProvider = ({
	value,
	children,
}: {
	value: IBtnGroupContext
	children: React.ReactNode
}) => {
	return (
		<DmcBtnGroupContext.Provider value={value}>
			{children}
		</DmcBtnGroupContext.Provider>
	)
}

export const useDmcBtnGroupContext = (): IBtnGroupContext => {
	const context = useContext(DmcBtnGroupContext)
	if (context === null) {
		throw new Error('BtnGroup component was not found in the tree')
	}
	return context
}

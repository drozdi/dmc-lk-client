import { createContext, useContext, useEffect, useState } from 'react'

interface FooterContextType {
	footer?: React.ReactNode
	setFooter: (...args: any[]) => void
	resetFooter: () => void
}

const FooterContext = createContext<FooterContextType | undefined>(undefined)

export const FooterProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [footer, setFooter] = useState<any>()
	const resetFooter = () => {
		setFooter('')
	}
	return (
		<FooterContext.Provider value={{ footer, setFooter, resetFooter }}>
			{children}
		</FooterContext.Provider>
	)
}

export const useFooter = () => {
	const context = useContext(FooterContext)
	if (context === undefined) {
		throw new Error('useFooter must be used within a FooterProvider')
	}
	return context
}

export function FooterTemplate({ children }) {
	const { setFooter } = useFooter()
	if (children) {
		setFooter(children)
	}
	useEffect(() => {
		return () => {
			setFooter('')
		}
	}, [])
	return ''
}

import { createSafeContext } from '../../internal/utils'

interface AccordionContext {
	value: string | string[] | undefined
	isActive: (value: string) => boolean
	getHeaderId: (value: string) => string
	getPanelId: (value: string) => string
	getTabId: (value: string) => string
	onChange: (event: React.ChangeEvent, value: string) => void
	onKeyDown: (event: React.KeyboardEvent) => void
}

export const [DmcAccordionProvider, useDmcAccordionContext] =
	createSafeContext<AccordionContext>()

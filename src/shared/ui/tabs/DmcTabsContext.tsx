import { createSafeContext } from '../../internal/utils'

interface TabsContext {
	value: string
	values: string[]
	keepMounted?: boolean
	vertical?: boolean
	isActive: (value: string) => boolean
	getTabId: (value: string) => string
	getPanelId: (value: string) => string
	onActiveTab: (value: string) => void
	onKeyDown: (event: React.KeyboardEvent) => void
}

export const [DmcTabsProvider, useDmcTabsContext] =
	createSafeContext<TabsContext>('DmcTabs component was not found in the tree')

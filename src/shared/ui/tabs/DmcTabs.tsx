import { useEffect, useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { scopedKeydownHandler } from '../../internal/events/scoped-keydown-handler'
import { cls } from '../../utils'
import { DmcTabsProvider } from './DmcTabsContext'
import { DmcTabsList } from './DmcTabsList'
import { DmcTabsPanel } from './DmcTabsPanel'
import { DmcTabsPanels } from './DmcTabsPanels'
import { DmcTabsTab } from './DmcTabsTab'
import './styles.css'

interface TabsProps {
	className?: string
	children?: React.ReactNode
	value?: string
	id?: string
	keepMounted?: boolean
	vertical?: boolean
	pills?: boolean
	onChange?: (value: string | undefined) => void
}

export function DmcTabs({
	className,
	children,
	value,
	id,
	keepMounted,
	vertical,
	pills,
	onChange,
	...props
}: TabsProps) {
	const uid = uuid(id)
	const [currentTab, setCurrentTab] = useState<string | undefined>(value)

	const context = useMemo(() => {
		const values: string[] = []
		const appendValue = (value: string) => {
			if (!values.includes(value)) {
				values.push(value)
			}
		}
		return {
			value: currentTab,
			values,
			keepMounted,
			vertical,
			isActive: (value: string) => value === currentTab,
			getTabId: (value: string) => {
				appendValue(value)
				return `${uid}-tab-${value}`
			},
			getPanelId: (value: string) => {
				appendValue(value)
				return `${uid}-panel-${value}`
			},
			onActiveTab: (value: string) => setCurrentTab(value),
			onKeyDown: scopedKeydownHandler({
				parentSelector: '[role="tablist"]',
				siblingSelector: '[role="tab"]',
				loop: true,
				activateOnFocus: true,
				orientation: 'xy',
			}),
		}
	}, [currentTab, keepMounted, vertical])
	useEffect(() => onChange?.(currentTab), [currentTab])
	useEffect(() => setCurrentTab(value as string), [value])
	useEffect(() => {
		if (!currentTab) {
			setCurrentTab(context.values[0])
		}
	}, [])
	return (
		<div
			id={uid}
			{...props}
			className={cls(
				'dmc-tabs',
				{
					'dmc-tabs--vertical': vertical,
					'dmc-tabs--pills': pills,
				},
				className
			)}
		>
			<DmcTabsProvider value={context}>{children}</DmcTabsProvider>
		</div>
	)
}

DmcTabs.List = DmcTabsList
DmcTabs.Panel = DmcTabsPanel
DmcTabs.Tab = DmcTabsTab
DmcTabs.Panels = DmcTabsPanels

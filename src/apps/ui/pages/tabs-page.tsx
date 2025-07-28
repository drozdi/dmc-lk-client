import { DmcTabs } from '../../../shared/ui'
import { Form, useProps } from './utils'

export function TabsPage() {
	const tabsExample = useProps(
		{
			keepMounted: false,
			vertical: false,
			pills: false,
		},
		'DmcTabs',
		`
		<DmcTabs.List grow>
			<DmcTabs.Tab
				value="item-1"
				leftSection="mdi-home"
				rightSection="mdi-close">
				Item 1
			</DmcTabs.Tab>
			<DmcTabs.Tab leftSection="mdi-home" value="item-2">
				Item 2
			</DmcTabs.Tab>
			<DmcTabs.Tab rightSection="mdi-close" value="item-3">
				Item 3
			</DmcTabs.Tab>
		</DmcTabs.List>
		<DmcTabs.Panels>
			<DmcTabs.Panel value="item-1">Tabs 1</DmcTabs.Panel>
			<DmcTabs.Panel value="item-2">Tabs 2</DmcTabs.Panel>
			<DmcTabs.Panel value="item-3">Tabs 3</DmcTabs.Panel>
		</DmcTabs.Panels>
	`
	)
	return (
		<div className='max-w-4xl m-auto'>
			<DmcTabs {...tabsExample.props}>
				<DmcTabs.List grow>
					<DmcTabs.Tab
						value='item-1'
						leftSection='mdi-home'
						rightSection='mdi-close'
					>
						Item 1
					</DmcTabs.Tab>
					<DmcTabs.Tab leftSection='mdi-home' value='item-2'>
						Item 2
					</DmcTabs.Tab>
					<DmcTabs.Tab disabled rightSection='mdi-close' value='item-3'>
						Item 3
					</DmcTabs.Tab>
				</DmcTabs.List>
				<DmcTabs.Panels>
					<DmcTabs.Panel value='item-1'>
						<div>Tabs 1</div>
						<div>Tabs 1</div>
					</DmcTabs.Panel>
					<DmcTabs.Panel value='item-2'>
						<div>Tabs 2</div>
						<div>Tabs 2</div>
					</DmcTabs.Panel>
					<DmcTabs.Panel value='item-3'>
						<div>Tabs 3</div>
						<div>Tabs 3</div>
					</DmcTabs.Panel>
				</DmcTabs.Panels>
			</DmcTabs>
			<div className='mt-8 grid grid-cols-2 *:col-span-1 *:p-4 *:border *:border-separator'>
				<div>
					<pre className='bg-sky-500/50 text-white p-2 rounded-md mt-4 select-text overflow-scroll'>
						{tabsExample.code}
					</pre>
				</div>
				<div>
					{Form(
						{
							keepMounted: { type: 'checkbox' },
							vertical: { type: 'checkbox' },
							pills: { type: 'checkbox' },
						},
						tabsExample
					)}
				</div>
			</div>
		</div>
	)
}

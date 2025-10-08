import { DatesProvider } from '@mantine/dates'
import 'dayjs/locale/ru'
import { Link } from 'react-router'
import { TemplateProvider } from '../layout/context'
import { RenderProvider } from '../shared/internal/render'

import { createTheme, Drawer, Group, Input, MantineProvider, SimpleGrid, Stack, Tabs } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import inputClasses from './input.module.css'

interface AppProviderProps {
	children: React.ReactNode
}

const theme = createTheme({
	components: {
		Drawer: Drawer.extend({
			defaultProps: {
				radius: 'xs',
				offset: '0.5rem',
				position: 'right',
				closeOnClickOutside: false,
				withCloseButton: false,
				overlayProps: {
					opacity: 0.1,
				},
			},
		}),
		TabsList: Tabs.List.extend({
			defaultProps: {
				pos: 'sticky',
				top: 0,
				bg: 'var(--mantine-color-body)',
				style: {
					zIndex: 10,
				},
			},
		}),
		TabsPanel: Tabs.Panel.extend({
			defaultProps: { keepMounted: true, p: 'xs', pt: 'xs' },
		}),
		Group: Group.extend({
			defaultProps: {
				mih: 30,
				gap: 'xs',
			},
		}),
		Stack: Stack.extend({
			defaultProps: {
				gap: 'xs',
			},
		}),
		SimpleGrid: SimpleGrid.extend({
			defaultProps: {
				spacing: 'xs',
				verticalSpacing: 'xs',
			},
		}),
		Input: Input.extend({
			classNames: inputClasses,
		}),
	},
})

export function AppProvider({ children }: AppProviderProps) {
	return (
		<MantineProvider withCssVariables theme={theme}>
			<DatesProvider settings={{ locale: 'ru' }}>
				<Notifications />
				<ModalsProvider>
					<RenderProvider render={({ as, to }: { to?: string; as?: any }) => (!!to ? Link : as)}>
						<TemplateProvider>{children}</TemplateProvider>
					</RenderProvider>
				</ModalsProvider>
			</DatesProvider>
		</MantineProvider>
	)
}

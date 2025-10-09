import { DatesProvider } from '@mantine/dates'
import 'dayjs/locale/ru'
import { Link } from 'react-router'
import { TemplateProvider } from '../layout/context'
import { RenderProvider } from '../shared/internal/render'

import { createTheme, Drawer, Flex, Group, Input, MantineProvider, SimpleGrid, Stack, Tabs } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import inputClasses from './input.module.css'

interface AppProviderProps {
	children: React.ReactNode
}

const theme = createTheme({
	primaryColor: 'primary',
	colors: {
		primary: [
			'#e6f6ff',
			'#d2e7fd',
			'#a6cdf4',
			'#77b1ed',
			'#509ae7',
			'#378be4',
			'#2884e4',
			'#1975d2',
			'#0864b6',
			'#0057a2',
		],
		// secondary: [
		// 	'#e2f9ff',
		// 	'#ceedff',
		// 	'#9fd8fb',
		// 	'#5cbbf6',
		// 	'#44aff3',
		// 	'#2aa4f2',
		// 	'#169ef2',
		// 	'#0089d8',
		// 	'#007ac3',
		// 	'#006aad',
		// ],
		// success: [
		// 	'#ebfbeb',
		// 	'#dbf2dc',
		// 	'#b9e1ba',
		// 	'#93d096',
		// 	'#74c277',
		// 	'#5fb963',
		// 	'#4caf50',
		// 	'#439e47',
		// 	'#398d3d',
		// 	'#2b7a31',
		// ],
		// accent: [
		// 	'#feecff',
		// 	'#f3d7f8',
		// 	'#e4aeed',
		// 	'#d481e2',
		// 	'#c75bd9',
		// 	'#bf44d4',
		// 	'#bb37d2',
		// 	'#9c27b0',
		// 	'#9322a6',
		// 	'#801892',
		// ],
		// warning: [
		// 	'#ffeaed',
		// 	'#fed5d9',
		// 	'#f3a9b0',
		// 	'#e97b85',
		// 	'#e15361',
		// 	'#dc3545',
		// 	'#dc2c3e',
		// 	'#c31e30',
		// 	'#af1629',
		// 	'#9a0822',
		// ],
		// info: [
		// 	'#e2f7ff',
		// 	'#cdeaff',
		// 	'#9dd3fc',
		// 	'#6abaf8',
		// 	'#40a5f5',
		// 	'#2196f3',
		// 	'#0b91f4',
		// 	'#007dda',
		// 	'#006fc4',
		// 	'#0060ae',
		// ],
		// danger: [
		// 	'#fff5e1',
		// 	'#ffeacc',
		// 	'#ffd39a',
		// 	'#ffbb64',
		// 	'#ffa637',
		// 	'#ff991b',
		// 	'#fb8c00',
		// 	'#e37e00',
		// 	'#cb7000',
		// 	'#b15f00',
		// ],
		// dark: [
		// 	'#f5f5f5',
		// 	'#e7e7e7',
		// 	'#cdcdcd',
		// 	'#b2b2b2',
		// 	'#9a9a9a',
		// 	'#8b8b8b',
		// 	'#848484',
		// 	'#717171',
		// 	'#656565',
		// 	'#1d1d1d',
		// ],
	}, //*/
	spacing: {
		base: '0.25rem',
		xs: '0.5rem',
		sm: '0.75rem',
		md: '1rem',
		lg: '1.5rem',
		xl: '2rem',
	},
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
		Flex: Flex.extend({
			defaultProps: {
				justify: 'space-between',
				align: 'flex-start',
				direction: 'row',
				wrap: 'nowrap',
				gap: 'xs',
			},
		}),
		Group: Group.extend({
			defaultProps: {
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
		<MantineProvider theme={theme}>
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

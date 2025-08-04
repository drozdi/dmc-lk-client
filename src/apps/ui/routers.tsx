import { Outlet } from 'react-router-dom'
import { AccordionPage } from './pages/accordion-page'
import { BtnGroupPage } from './pages/btn-group-page'
import { BtnPage } from './pages/btn-page'
import { IconPage } from './pages/icon-page'
import { IndexPage } from './pages/index-page'
import { InputPage } from './pages/input-page'
import { LinkPage } from './pages/link-page'
import { ListPage } from './pages/list-page'
import { ProgressPage } from './pages/progress-page'
import { SpinnerPage } from './pages/spinner-page'
import { TabsPage } from './pages/tabs-page'

export default function ({ path = '/ui' }: AppRouterProps = {}): object {
	return {
		path: path,
		element: <Outlet />,
		children: [
			{
				path: '',
				element: <IndexPage />,
			},
			{
				path: 'icon',
				element: <IconPage />,
			},
			{
				path: 'btn',
				element: <BtnPage />,
			},
			{
				path: 'btn-group',
				element: <BtnGroupPage />,
			},
			{
				path: 'list',
				element: <ListPage />,
			},
			{
				path: 'link',
				element: <LinkPage />,
			},
			{
				path: 'input',
				element: <InputPage />,
			},
			{
				path: 'tabs',
				element: <TabsPage />,
			},
			{
				path: 'accordion',
				element: <AccordionPage />,
			},
			{
				path: 'progress',
				element: <ProgressPage />,
			},
			{
				path: 'spinner',
				element: <SpinnerPage />,
			},
		],
	}
}

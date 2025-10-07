import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { AppLoader } from './app/app-loader'
import { AppProvider } from './app/app-provider'
import { AppRouters } from './app/app-routers'
import './shared/style/index.css'

createRoot(document.querySelector('body')!).render(
	<BrowserRouter>
		<AppProvider>
			<AppLoader>
				<AppRouters />
			</AppLoader>
		</AppProvider>
	</BrowserRouter>
)

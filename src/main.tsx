import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppLoader } from './app/app-loader'
import { AppProvider } from './app/app-provider'
import { AppRouters } from './app/app-routers'
import './shared/style/index.css'

import { getBaseUrl } from './shared/utils'

createRoot(document.querySelector('body')!).render(
	<BrowserRouter basename={getBaseUrl()}>
		<AppProvider>
			<AppLoader>
				<AppRouters />
			</AppLoader>
		</AppProvider>
	</BrowserRouter>
)

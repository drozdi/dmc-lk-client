import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { AppLoader } from './app/app-loader'
import { AppProvider } from './app/app-provider'
import { AppRouters } from './app/app-routers'
import './shared/style/index.css'

createRoot(document.getElementById('root')!).render(
	<BrowserRouter>
		<AppLoader>
			<AppProvider>
				<AppRouters />
			</AppProvider>
		</AppLoader>
	</BrowserRouter>
)

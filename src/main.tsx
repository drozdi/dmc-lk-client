import { createRoot } from "react-dom/client";
import { AppLoader } from "./app/app-loader";
import { AppProvider } from "./app/app-provider";
import { AppRouters } from "./app/app-routers";
import "./shared/style/index.css";

createRoot(document.querySelector("body")!).render(
	<AppProvider>
		<AppLoader>
			<AppRouters />
		</AppLoader>
	</AppProvider>,
);

import { createRoot } from "react-dom/client";
import { AppLoader } from "./app/app-loader";
import { AppProvider } from "./app/app-provider";
import { AppRouters } from "./app/app-routers";
import "./app/widgets";
import { LoaderStatus } from "./features/loader/status";
import "./shared/style/index.css";

if (typeof TouchEvent === "undefined") {
	window.TouchEvent = class TouchEvent extends Event {
		constructor(type, options = {}) {
			super(type, options);
			this.touches = options.touches || [];
			this.targetTouches = options.targetTouches || [];
			this.changedTouches = options.changedTouches || [];
		}
	};
}

createRoot(document.querySelector("body")!).render(
	<AppProvider>
		<AppLoader>
			<AppRouters />
			<LoaderStatus position={{ top: 100, right: 20 }} size="xl" />
		</AppLoader>
	</AppProvider>,
);

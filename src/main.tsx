import { createRoot } from "react-dom/client";
import { AppLoader } from "./app/app-loader";
import { AppProvider } from "./app/app-provider";
import { AppRouters } from "./app/app-routers";
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

window.fake = true;

createRoot(document.querySelector("body")!).render(
	<AppProvider>
		<AppLoader>
			<AppRouters />
		</AppLoader>
	</AppProvider>,
);

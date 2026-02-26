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

import { labelName } from "./shared/utils";

console.log(labelName("W   60  .3,4  5  H   40.5345,   G1"));

createRoot(document.querySelector("body")!).render(
	<AppProvider>
		<AppLoader>
			<AppRouters />
		</AppLoader>
	</AppProvider>,
);

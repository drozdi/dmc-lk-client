import { createRoot } from "react-dom/client";
import { App } from './app';
import { AppProvider } from "./app/app-provider";

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
	<AppProvider><App /></AppProvider>,
);

import { FactoryWidget } from "@/entites/dashboard/utils/factory-widget";

let loadPromise: Promise<void> | null = null;

export function isAnalyticsWidgetsLoaded() {
	return FactoryWidget.getAvailableTypes().includes("analytic-events");
}

export function loadAnalyticsWidgets() {
	if (isAnalyticsWidgetsLoaded()) {
		return Promise.resolve();
	}

	if (!loadPromise) {
		loadPromise = import("./index").then(() => undefined);
	}

	return loadPromise;
}

import { useEnumsEvents, useEnumsStep } from "@/entites/analytics";
import { FactoryWidget } from "@/entites/widget/utils/factory-widget";
import { WidgetLabelsCount } from "./count";

const es = useEnumsStep();
const ee = useEnumsEvents();

FactoryWidget.register({
	type: "labels-count",
	component: WidgetLabelsCount,
	label: "Сводная история",
	description: "Сводная история (Description)",
	params: [],
});

export * from "./count";

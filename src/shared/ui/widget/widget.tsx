import {
	type ExpandablePanelProps,
	ExpandablePanel,
} from "../expandable-panel";

export interface WidgetProps extends ExpandablePanelProps {}

export function Widget(props: WidgetProps) {
	return <ExpandablePanel {...{ ...props, w: "100%", h: "100%" }} />;
}

import { useDashboard } from "../context";

export function DadshBoardItem(props: IWidget) {
	const dashboard = useDashboard();
	return dashboard.renderWidget(props);
}

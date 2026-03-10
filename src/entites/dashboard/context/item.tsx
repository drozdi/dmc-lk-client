import { DashboardItemProvider, useDashboard } from "./context";

interface DashBoardItemProps {
	id: string;
	children: React.ReactNode | string;
}

export function DashBoardItem({ id, children }: DashBoardItemProps) {
	const dashboard = useDashboard();
	return <DashboardItemProvider>{children}</DashboardItemProvider>;
	// return <div {...props}>{children}</div>;
}

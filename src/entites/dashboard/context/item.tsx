import { useDashboard } from "./context";

interface DashBoardItemProps {
	children: React.ReactNode;
	[key: string]: any;
}

export function DashBoardItem({ children, ...params }: DashBoardItemProps) {
	const dashboard = useDashboard();

	return <div {...params}>{children}</div>;
}

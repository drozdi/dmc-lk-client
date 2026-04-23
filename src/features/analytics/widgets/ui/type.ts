import { MouseHandlerDataParam } from "recharts";

export interface EventsProps {
	query: IRequestAnalytics;
	data: (Record<AnalyticEvent, number> & {
		date: string;
		total: number;
	})[];
	events?: AnalyticEvent[];
	onClick?: (arg: MouseHandlerDataParam, e: React.MouseEvent) => void;
}

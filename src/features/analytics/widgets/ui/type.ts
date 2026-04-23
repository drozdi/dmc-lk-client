import { type MouseHandlerDataParam } from "recharts";

export interface EventsProps {
	query: IRequestAnalytics;
	data: (Record<AnalyticEvent, number> & {
		date: string;
		total: number;
	})[];
	events?: AnalyticEvent[];
	onClick?: (arg: MouseHandlerDataParam, e: React.MouseEvent) => void;
}

export interface LabelsProps {
	query: IRequestAnalytics;
	type?: "stack" | "default" | "table";
	data: Array<{
		date: string;
		total: number;
		[key: string]: string | number;
	}>;
	labels?: string[];
	bars: string[];
}

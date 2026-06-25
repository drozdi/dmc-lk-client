import {
	eventsFindColorByCode,
	useAnalytics,
} from "@/entites/analytics";
import { useStoreUserProfile } from "@/entites/auth";
import { Text } from "@/shared/ui";
import { StatSkeleton } from "@/shared/ui/skeleton";
import { NumberFormatter, SimpleGrid, Stack } from "@mantine/core";
import { useMemo } from "react";

export interface AnalyticItogSummaryProps {
	filterdate: IRequestAnalytics["filterdate"];
}

type SummaryMetric = {
	key: string;
	label: string;
	event: AnalyticEvent;
	type: "sum" | "min" | "max" | "avg";
	color?: string;
};

const METRICS: SummaryMetric[] = [
	{ key: "sum", label: "Расход этикеток", event: "p", type: "sum" },
	{ key: "avg", label: "Средний расход", event: "p", type: "avg" },
	{ key: "min", label: "Минимальный расход", event: "p", type: "min" },
	{ key: "max", label: "Максимальный расход", event: "p", type: "max" },
	{
		key: "d-max",
		label: "Макс. дефектов",
		event: "d",
		type: "max",
		color: eventsFindColorByCode("d"),
	},
];

function calcMetricValue(
	data: IResponseAnalytics | undefined,
	type: SummaryMetric["type"],
): number {
	if (!data) {
		return 0;
	}

	if (type === "min") {
		let min = Infinity;
		for (const production of data.production || []) {
			for (const item of production.data) {
				if (item.data.length > 15) {
					continue;
				}
				min = Math.min(min, item.count);
			}
		}
		return min === Infinity ? (data.min_company ?? 0) : min;
	}

	if (type === "max") {
		return data.max_company ?? 0;
	}

	if (type === "avg") {
		return Math.round(data.average_company ?? 0);
	}

	return data.sum_company ?? 0;
}

function SummaryCell({
	filterdate,
	metric,
}: {
	filterdate: IRequestAnalytics["filterdate"];
	metric: SummaryMetric;
}) {
	const production_id = useStoreUserProfile((state) => state.productions);
	const { data, isLoading, isFetching } = useAnalytics({
		filterdate,
		event: metric.event,
		production_id,
	});

	const value = useMemo(
		() => calcMetricValue(data, metric.type),
		[data, metric.type],
	);

	const showSkeleton = (isLoading || isFetching) && !data?.production?.length;

	if (showSkeleton) {
		return <StatSkeleton />;
	}

	return (
		<Stack gap={4}>
			<Text fz="xs" c="dimmed">
				{metric.label}
			</Text>
			<Text fz="xl" ta="right" c={metric.color}>
				<NumberFormatter value={value} />
			</Text>
		</Stack>
	);
}

export const AnalyticItogSummary = ({
	filterdate,
}: AnalyticItogSummaryProps) => {
	return (
		<SimpleGrid cols={2} spacing="md">
			{METRICS.map((metric) => (
				<SummaryCell key={metric.key} filterdate={filterdate} metric={metric} />
			))}
		</SimpleGrid>
	);
};

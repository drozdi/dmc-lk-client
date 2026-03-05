import { $setting } from "@/shared";
import { Select } from "@mantine/core";

interface HistoryPaginationProps {
	limit: number;
	onLimit?: (limit: number) => void;
}

export function HistoryPagination({ limit, onLimit }: HistoryPaginationProps) {
	return (
		<>
			<Select
				data={$setting.get("limits")}
				value={String(limit)}
				onChange={(value) => onLimit?.(Number(value))}
			/>
		</>
	);
}

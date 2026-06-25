import { Select } from "@mantine/core";
import { memo, useCallback } from "react";
import { $setting } from "@/shared";

interface HistoryPaginationProps {
	limit: number;
	onLimit?: (limit: number) => void;
}

function HistoryPaginationRoot({ limit, onLimit }: HistoryPaginationProps) {
	const handleChange = useCallback(
		(value: string | null) => onLimit?.(Number(value)),
		[onLimit],
	);

	return (
		<Select
			data={$setting.get("limits")}
			value={String(limit)}
			onChange={handleChange}
		/>
	);
}

export const HistoryPagination = memo(HistoryPaginationRoot);

import { type ComboboxItem } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { requestAnalyticsFields } from "../api/fields";

export function useQueryAnalyticsFields() {
	const q = useQuery({
		queryKey: ["analytics", "fields"],
		queryFn: async () => await requestAnalyticsFields(),
		select(data): IResponseAnalyticsFields {
			return data.message;
		},
	});
	const findByCode = useCallback((code: string) => q.data?.[code], [q.data]);
	const findLabelByCode = useCallback(
		(code: string) => findByCode(code)?.label || code,
		[findByCode],
	);
	const dataSelect = useMemo<ComboboxItem[]>(
		() =>
			Object.entries(q.data || []).map(([code, item]) => ({
				value: code,
				label: item.label,
			})),
		[q.data],
	);

	return { ...q, dataSelect, findByCode, findLabelByCode };
}

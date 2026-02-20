import { type ComboboxItem } from "@mantine/core";
import { useMemo } from "react";
import { useQueryAnalyticsFields } from "./use-query-analytics-fields";

export function factoryEnumsAnalytics(fields: string[]) {
	return function () {
		const qaf = useQueryAnalyticsFields();
		const data = useMemo(
			() =>
				Object.fromEntries(
					Object.entries(qaf.data || {}).filter(([field]) =>
						fields.includes(field),
					),
				),
			[qaf.data],
		);
		const dataSelect = useMemo<ComboboxItem[]>(
			() => qaf.dataSelect.filter((item) => fields.includes(item.value)),
			[qaf.dataSelect],
		);

		return { ...qaf, data, dataSelect };
	};
}

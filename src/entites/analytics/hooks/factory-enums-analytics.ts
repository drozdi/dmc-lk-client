import { type ComboboxItem } from "@mantine/core";
import { useCallback, useMemo } from "react";
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

		const filter = useCallback<(fields: string[]) => string[]>(
			(fields: string[]) => {
				// console.log([...new Set(dataSelect.map((item) => item.value))]);
				// console.log([...new Set(fields)]);
				// console.log([
				// 	...new Set(dataSelect.map((item) => item.value)).intersection(
				// 		new Set(fields),
				// 	),
				// ]);
				return [
					...new Set(dataSelect.map((item) => item.value)).intersection(
						new Set(fields),
					),
				];
			},
			[dataSelect],
		);

		return { ...qaf, data, fields, filter, dataSelect };
	};
}

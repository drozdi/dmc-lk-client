import { useStoreUserProfile } from "@/entites/auth";
import { type ComboboxItem } from "@mantine/core";
import { Select, useEffect, useMemo, useState } from "react";

export function Productions({ data, onChange }) {
	const { production_id: storeProductionId } = useStoreUserProfile();
	const [production_id, setProductionId] = useState(storeProductionId);

	const productions = useMemo<ComboboxItem[]>(() => {
		if (data) {
			return (
				((data?.v || data?.i || data?.d || data?.p)
					?.production as IAnalyticsProduction[]) || []
			).map((item) => ({
				value: String(item.production_id),
				label: item.name,
			}));
		}
		return [];
	}, [data]);

	useEffect(() => {
		setProductionId(storeProductionId);
	}, [storeProductionId]);

	return (
		<Select
			defaultValue={String(production_id)}
			checkIconPosition="right"
			onChange={(val: string) => setProductionId(val)}
			data={[
				{
					value: "0",
					label: "Все площадки",
				},
			].concat(productions as any)}
		/>
	);
}
